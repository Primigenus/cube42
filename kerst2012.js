if (Meteor.isClient) {
  var level = 1;
  var actions = [];
  var messages = [
    "Click the yellow cube to begin.",
    "Good job! You can toggle cubes on and off.",
    "The numbers at the bottom show the total of all numbers on a face.",
    "Your goal is to toggle cubes on and off until each face totals 42."
  ];
  var showingFace = "front";
  var currentMatrix = "";

  Meteor.startup(function() {
    var toh;

    //Session.set("loading", false);
    Session.set("showMessage", 0);
    Session.set("level", level);

    // add cubes
    $(".cube").each(function(i, el) {
      $(el).attr("data-nr", i);
      setCubeValue($(el), 1+ ~~(Math.random() * 9));
    });

    makePuzzle(level);

    $($(".cube .front")[3]).css("box-shadow", "inset 0 0 30px yellow").find("span").css("color", "yellow");

    // animate cube onload to show that it's 3d
    $("#master-cube").css({
      "-webkit-transition-duration": "2s",
      "-webkit-transform": "rotate3d(0, 1, 0, 360deg) " + currentMatrix
    });
    Meteor.setTimeout(function() {
      $("#master-cube").css({
        "-webkit-transition-duration": "0s",
        "-webkit-transform": "rotate3d(0, 1, 0, 0deg) " + currentMatrix
      });
      Meteor.setTimeout(function() {
        $("#master-cube").css("-webkit-transition-duration", "1s");
      }, 1);
    }, 3000);
    
    Meteor.setInterval(fixOrientation, 500);

    $(document).keyup(function(e) {
      Meteor.clearTimeout(toh);

      var dir = e.which;

      // left
      /*if (dir == 37 && showingFace == "front") return showFace("right");
      if (dir == 37 && showingFace == "left") return showFace("front");
      if (dir == 37 && showingFace == "back") return showFace("left");
      if (dir == 37 && showingFace == "right") return showFace("back");
      if (dir == 37 && showingFace == "top") return showFace("left");

      // right
      if (dir == 39 && showingFace == "front") return showFace("left");
      if (dir == 39 && showingFace == "left") return showFace("back");
      if (dir == 39 && showingFace == "back") return showFace("right");
      if (dir == 39 && showingFace == "right") return showFace("front");
      if (dir == 39 && showingFace == "top") return showFace("right");

      // up
      if (dir == 38 && (showingFace == "front" || showingFace == "left" || showingFace == "right")) return showFace("top");
      if (dir == 38 && showingFace == "back") return showFace("top");
      if (dir == 38 && showingFace == "bottom") return showFace("back");
      if (dir == 38 && showingFace == "top") return showFace("front");

      // down
      if (dir == 40 && (showingFace == "front" || showingFace == "left" || showingFace == "right")) return showFace("bottom");
      if (dir == 40 && showingFace == "back") return showFace("top");
      if (dir == 40 && showingFace == "bottom") return showFace("back");
      if (dir == 40 && showingFace == "top") return showFace("front");*/

      if (e.which == 37) {// left
        currentMatrix = "rotate3d(0, 1, 0, -90deg) " + currentMatrix;
        actions.push("left");
      }
      else if (e.which == 39) {// right
        currentMatrix = "rotate3d(0, 1, 0, 90deg) " + currentMatrix;
        actions.push("right");
      }
      else if (e.which == 38) {// up
        currentMatrix = "rotate3d(1, 0, 0, 90deg) " + currentMatrix;
        actions.push("up");
      }
      else if (e.which == 40) {// down
        currentMatrix = "rotate3d(1, 0, 0, -90deg) " + currentMatrix;
        actions.push("down");
      }

      if (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40) {
        $("#master-cube").css("-webkit-transform", currentMatrix);

        toh = Meteor.setTimeout(function() {
          currentMatrix = $("#master-cube").css("-webkit-transform");
          if (currentMatrix == "none")
            currentMatrix = "";
        }, 1050);
      }

    });
    
    var dragStartData = null;
    $(document).mousedown(function(evt) { 
      dragStartData = {
        x: evt.pageX,
        y: evt.pageY,
        matrix: $("#master-cube").css("-webkit-transform"),
        transition: $("#master-cube").css("-webkit-transition")
      }; 
      $("#master-cube").css("-webkit-transition", "none")
    });
    $(document).mouseup(function() { 
      $("#master-cube").css("-webkit-transition", dragStartData.transition);
      dragStartData = null; 
    });
    $(document).mousemove(function(evt) { 
      if (dragStartData)
      {
        if (dragStartData.matrix == "none")
          dragStartData.matrix = "";
        var deltaX = evt.pageX - dragStartData.x;
        var deltaY = evt.pageY - dragStartData.y;
        var len = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        $("#master-cube").css("-webkit-transform", 
          "rotate3D(" + -deltaY + ", " + deltaX + ", 0, " + len/5 + "deg) " + dragStartData.matrix);
        currentMatrix = $("#master-cube").css("-webkit-transform");
      }
    });
  });

  function showFace(face) {
    var transform = "";
    switch (face) {
      case "front":
        transform = "0,0,0,0";
        break;
      case "back":
        transform = "1,0,0,180deg";
        break;
      case "left":
        transform = "0,1,0,90deg";
        break;
      case "right":
        transform = "0,1,0,-90deg";
        break;
      case "top":
        transform = "1,0,0,-90deg";
        break;
      case "bottom":
        transform = "1,0,0,90deg";
        break;
    }
    showingFace = face;
    currentMatrix = "none";
    $("#master-cube").css("-webkit-transform", "rotate3d(" + transform + ")");
  }
  
  function fixOrientation()
  {
    var matrix = $("#master-cube").css("-webkit-transform");
    var m = matrix.match(/^matrix3d\((.*)\)$/);
    if (!m)
      return;
    matrix = m[1].split(", ");
    
    var x = 1*matrix[1];
    var y = 1*matrix[5];
    var angle = Math.abs(y) > Math.abs(x) ? y > 0 ? 0 : 180 : x > 0 ? -90 : 90;
    $(".front span").css("-webkit-transform", "rotate(" + angle + "deg)");
    angle = Math.abs(y) > Math.abs(x) ? y > 0 ? 0 : 180 : x > 0 ? 90 : -90;
    $(".back span").css("-webkit-transform", "rotate(" + angle + "deg)");

    var x = 1*matrix[4];
    var y = 1*matrix[5];
    var angle = Math.abs(y) > Math.abs(x) ? y > 0 ? 0 : 180 : x > 0 ? 90 : -90;
    $(".left span").css("-webkit-transform", "rotate(" + angle + "deg)");
    $(".right span").css("-webkit-transform", "rotate(" + angle + "deg)");

    var x = 1*matrix[0];
    var y = 1*matrix[1];    
    var angle = Math.abs(y) > Math.abs(x) ? y > 0 ? -90 : 90 : x > 0 ? 0 : 180;
    $(".bottom span").css("-webkit-transform", "rotate(" + angle + "deg)");
    var angle = Math.abs(y) > Math.abs(x) ? y > 0 ? 90 : -90 : x > 0 ? 0 : 180;
    $(".top span").css("-webkit-transform", "rotate(" + -angle + "deg)");
  }

  Template.body.events({
    'click .cube': function(evt) {
      if (Session.equals("showMessage", 0))
        Session.set("showMessage", 1);
      $el = $(evt.target).parents(".cube");
      if (!$el.hasClass("removed"))
      {
        $el.toggleClass("clicked");
        calcFaces($(evt.target).text());
      }
    },
    'click .face': function(evt) {
      showFace(evt.target.className.split(" ")[1]);
    }
  });

  Template.body.isLoading = function() {
    //return Session.equals('loading', true);
  }

  Template.explanation.message = function() {
    return messages[Session.get("showMessage") * 1];
  }

  function getCube(x, y, z, type) {
    return $($("." + type)[x + 3*y + 9*z]);
  }

  function getFaces() {
    return {front: calcFront(), back: calcBack(), left: calcLeft(), right: calcRight(), top: calcTop(), bottom: calcBottom()};
  }

  function calcFaces() {
    var results = getFaces();
    var str = "";
    var count42 = 0;
    for (var face in results) {
      var total = _.reduce(results[face], function(x,y) { return x + 1*y.text();}, 0);
      if (total == 42)
        count42++;
      str += "<span class='face "+face+"'>" + total + "</span>";
    }
    $("#total").html(str);

    if (count42 == 6)
    {
      //var level = Session.get('level') * 1;
      level++;
      //Session.set("level", level);
      alert("Gelukt! Op naar level " + level);
      $("#level").text("Level " + level);
      makePuzzle(level);
    }
  }

  function removeLoading() {
    $("#loading").hide();
    $("#master-cube").css("-webkit-transform", "");
  }

  var centerCube = 1 + 3 + 9;
  var onCubes = mkShuffled(0, 3 * 3 * 3 - 1, centerCube);
  var offCubes = [centerCube];
  function makePuzzle(difficulty)
  {
    if (difficulty == 1)
      $($(".cube")[centerCube]).addClass("clicked");
    
    // Really remove the off cubes from the last puzzle
    for (var i = 0; i < offCubes.length; i++)
      $($(".cube")[offCubes[i]]).addClass("removed");
        
    console.log("Make puzzle", difficulty, "...");

    // Choose new set of cubes to turn off
    offCubes = onCubes.splice(0, difficulty);

    // and turn those off
    for (var i = 0; i < offCubes.length; i++)
      $($(".cube")[offCubes[i]]).toggleClass("clicked");

    return tryPuzzle();


    function tryPuzzle()
    {
      console.log("try puzzle")
      var faces = getFaces();
      var state = {};
      var cubeEffects = {};
      for (var id in faces)
      {
        var face = faces[id];
        state[id] = { sum: 0, emptyCount: face.length };
        for (var i = 0; i < face.length; i++)
        {
          var cubeid = face[i].parent().attr("data-nr");
          cubeEffects[cubeid] = cubeEffects[cubeid] || [];
          cubeEffects[cubeid].push(id);
        }
      }
      
      // set others to zero
      var shuffles = [];
      for (var i = 0; i < onCubes.length; i++)
        shuffles[i] = mkShuffled(1, 9);
      
      var t0 = 1*new Date();
      try
      {
        if (!findSolution(0))
        {
          alert("Kan geen puzzel maken.")
          return;
        }
        removeLoading();
        for (var i = 0; i < offCubes.length; i++)
          $($(".cube")[offCubes[i]]).toggleClass("clicked");
        calcFaces();
      }
      catch(e)
      {
        // took too long, retry
        return setTimeout(tryPuzzle, 1);
      }

      function findSolution(depth)
      {
        if (new Date() - t0 > 300)
          throw "too slow";
        if (!isStillPossible(state))
          return false;
        if (depth == onCubes.length)
          return true; // Found a valid puzzle!
        var cubeid = onCubes[depth];
        var shuffled = shuffles[depth];
        for (var i = 0; i < 9; i++)
        {
          // Try a value
          updateState(cubeid, shuffled[i]);
          if (findSolution(depth + 1))
          {
            // It worked, set it.
            setCubeValue($($(".cube")[cubeid]), shuffled[i]);
            return true;
          }
          // Undo it
          resetState(cubeid, shuffled[i])
        }
        return false;
      }
  
      function updateState(cubeid, value)
      {
        for (var i = 0; i < cubeEffects[cubeid].length; i++)
        {
          var s = state[cubeEffects[cubeid][i]];
          s.sum += value;
          s.emptyCount--;
        }
      }
  
      function resetState(cubeid, value)
      {
        for (var i = 0; i < cubeEffects[cubeid].length; i++)
        {
          var s = state[cubeEffects[cubeid][i]];
          s.sum -= value;
          s.emptyCount++;
        }
      }
  
      function isStillPossible(state)
      {
        for (var id in state)
        {
          var sum = state[id].sum;
          var emptyCount = state[id].emptyCount;
          if (sum + emptyCount * (emptyCount + 1) / 3 > 42)
            return false;
          if (sum + 10 * emptyCount - emptyCount * (emptyCount + 1) / 3 < 42)
            return false;
        }
        return true;
      }
    }
  }

  function setCubeValue($cube, value)
  {
    $cube.children().each(function (i, el) {
      $(el).find("span").text(value);
    });
  }

  function mkShuffled(min, max, skip)
  {
    var a = [];
    for (var i = min; i <= max; i++)
      if (i != skip)
        a.splice(~~(Math.random() * (a.length + 1)), 0, i);
    return a;
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}