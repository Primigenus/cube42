if (Meteor.isClient)
{
  var level = 1;
  var instruction = 0;
  var currentMatrix = "";
  var messages = [
    "Toggle a single cube to advance to the next level.",
    "Good job! Now toggle two cubes to make it to level 3.",
    "Is it getting harder yet? 3 cubes now!",
    "Wow, level 4! Bet you can't beat this one."
  ];

  Meteor.startup(function()
  {
    Session.set("message", 0);
    Session.set("level", level);
    Session.set("numToggledCubes", 0);

    $("[data-role='lettering']").lettering();

    $(".cube").each(function(i, el) {
      $(el).attr("data-nr", i);
      setCubeValue($(el), 1+ ~~(Math.random() * 9));
    });

    makePuzzle(level);

    Meteor.setInterval(fixOrientation, 500);

    attachEventListeners();
  });

  function attachEventListeners()
  {
    var toh;

    $(document).keyup(function(e) {
      Meteor.clearTimeout(toh);

      var dir = e.which;

      if (e.which == 37) {// left
        currentMatrix = "rotate3d(0, 1, 0, -90deg) " + currentMatrix;
      }
      else if (e.which == 39) {// right
        currentMatrix = "rotate3d(0, 1, 0, 90deg) " + currentMatrix;
      }
      else if (e.which == 38) {// up
        currentMatrix = "rotate3d(1, 0, 0, 90deg) " + currentMatrix;
      }
      else if (e.which == 40) {// down
        currentMatrix = "rotate3d(1, 0, 0, -90deg) " + currentMatrix;
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

    $("[data-role='play']").click(function(){play()});
    $("[data-role='instructions']").click(function(){showInstructions()});

    $("#instructions,#instructions li").click(function() {
      instruction++;
      showInstruction(instruction);
    });
  }

  function showFace(face)
  {
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
      var $el = $(evt.target).parents(".cube");
      if (!$el.hasClass("removed"))
      {
        $el.toggleClass("clicked");

        var num = Session.get("numToggledCubes")*1;
        if ($el.hasClass("clicked"))
          num++;
        else
          num--;
        Session.set("numToggledCubes", num);

        calcFaces($(evt.target).text());
      }
    }
  });

  Template.header.currLevel = function() {
    return Session.get("level");
  }

  Template.header.toggledCubes = function() {
    var num = Session.get("numToggledCubes") * 1;
    var level = Session.get("level") * 1;
    var result = [];
    for (var i = 0; i < level; i++)
      result.push({active: i < num? "active" : ""});
    return result;
  }

  function nextLevel()
  {
    Meteor.defer(function() {
      var msg = Session.get("message")*1;
      msg++;
      alert(messages[msg]);
      Session.set("message", msg);

      Session.set("level", level);
      Session.set("numToggledCubes", 0);

      makePuzzle(level);
    });
  }

  function getCube(x, y, z, type)
  {
    return $($("." + type)[x + 3*y + 9*z]);
  }

  function getFaces()
  {
    return {front: calcFront(), back: calcBack(), left: calcLeft(), right: calcRight(), top: calcTop(), bottom: calcBottom()};
  }

  function calcFaces()
  {
    var results = getFaces();
    var str = "";
    var count42 = 0;
    for (var face in results) {
      var total = _.reduce(results[face], function(x,y) { return x + 1*y.text();}, 0);
      if (total == 42)
        count42++;
      Session.set("total" + face, total);
    }

    if (count42 == 6)
    {
      level++;
      nextLevel(level);
    }
  }

  Template.totals.events({
    'click .face': function(evt) {
      showFace(evt.target.className.split(" ")[1]);
    }
  });
  Template.totals.faces = function() {
    var results = [
      {face: "front", total: Session.get("totalfront")},
      {face: "back", total: Session.get("totalback")},
      {face: "left", total: Session.get("totalleft")},
      {face: "right", total: Session.get("totalright")},
      {face: "top", total: Session.get("totaltop")},
      {face: "bottom", total: Session.get("totalbottom")}
    ];
    return results;
  }

  function play()
  {
    $("#loading").hide();
    $("#master-cube").css("-webkit-transform", "");
    $(document.body).removeClass('instructions');
    spinCube();
  }

  function showInstructions()
  {
    play();
    $(document.body).addClass('instructions');
    instruction = 0;
    showInstruction(instruction);
  }

  function showInstruction(i) {
    $("#instructions li").hide();

    var inst = $("#instructions li")[i];
    if (!inst) {
      $(document.body).removeClass('instructions');
      $("#loading").show();
      return;
    }
    var $inst = $(inst);
    $inst.show();

    // specific actions to execute while showing an instruction
    switch (i) {
      case 3:
        $($(".cube")[3]).addClass("clicked");
        break;
      case 5:
        $($(".cube")[3]).removeClass("clicked");
        showFace("left");
        Meteor.setTimeout(function() {
          showFace("front");
        }, 1800);
        break;
    }
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
          if (confirm("Kan geen puzzel maken. Reload?"))
            window.location.reload();
          return;
        }

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

  function spinCube()
  {
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
  }
}

if (Meteor.isServer)
{
  Meteor.startup(function ()
  {
    // code to run on server at startup
  });
}