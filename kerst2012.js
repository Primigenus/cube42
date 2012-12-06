if (Meteor.isClient) {
  
  var level = 1;

  Template.body.events({
    'click .cube': function(evt) {
      // template data, if any, is available in 'this'
      $(evt.target).parent().toggleClass("clicked");
      calcFaces();
    }
  });

  function getCube(x, y, z, type) {
    return $($("." + type)[x + 3*y + 9*z]);
  }

  function isClicked(x, y, z) {
    return getCube(x, y, z, "cube").hasClass("clicked");
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
      level++;
      alert("Gelukt! Op naar level " + level);
      makePuzzle(level);
    }
  }

  var centerCube = 1 + 3 + 9;
  function resetCube()
  {
    // turn all cubes on
    $(".cube").each(function(i, el) {
      $(el).toggleClass("clicked", i == centerCube);
    })
  }

  function makePuzzle(difficulty)
  {
    resetCube()

    var onCubes = mkShuffled(0, 3 * 3 * 3 - 1, centerCube);
    var offCubes = onCubes.splice(0, difficulty);

    // and turn those off
    for (var i = 0; i < offCubes.length; i++)
      $($(".cube")[offCubes[i]]).toggleClass("clicked");

    var faces = getFaces();
    var state = {};
    var cubeEffects = {};
    for (var id in faces)
    {
      var face = faces[id];
      state[id] = { sum: 0, emptyCount: face.length };
      for (var i = 0; i < face.length; i++)
      {
        var cubeid = face[i].parent().attr("nr");
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
      findSolution(0);
    }
    catch(e)
    {
      // took too long, retry
      return makePuzzle(difficulty);
    }

    resetCube();
    calcFaces();

    return;

    function findSolution(depth)
    {
      if (new Date() - t0 > 300)
        throw "too slow";
      if (!isStillPossible())
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

    function isStillPossible()
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

  function setCubeValue($cube, value)
  {
    $cube.children().each(function (i, el) { $(el).text(value); });
  }

  function mkShuffled(min, max, skip)
  {
    var a = [];
    for (var i = min; i <= max; i++)
      if (i != skip)
        a.splice(~~(Math.random() * (a.length + 1)), 0, i);
    return a;
  }

  Meteor.startup(function() {
    var currentMatrix = "";
    var toh;

    $(".cube").each(function(i, el) {
      $(el).attr("nr", i);
      setCubeValue($(el), 1+ ~~(Math.random() * 9));
    });

    makePuzzle(level);

    $(document).mousemove(function(e) {
      $("#container").css("-webkit-perspective", Math.max(300, e.clientX) + "px");
      //$("#master-cube").css("-webkit-transform", "translateZ(" + ~~(-e.clientY/10) + "px) rotateY(" + ~~(e.clientY/3) + "deg)");
    });

    $(document).keyup(function(e) {
      var key = e.which;
      var rotation = "";

      clearTimeout(toh);

      if (e.which == 37) // left
        currentMatrix = "rotate3d(0, 1, 0, -90deg) " + currentMatrix;
      else if (e.which == 39) // right
        currentMatrix = "rotate3d(0, 1, 0, 90deg) " + currentMatrix;
      else if (e.which == 38) // up
        currentMatrix = "rotate3d(1, 0, 0, 90deg) " + currentMatrix;
      else if (e.which == 40) // down
        currentMatrix = "rotate3d(1, 0, 0, -90deg) " + currentMatrix;

      $("#master-cube").css("-webkit-transform", currentMatrix);

      toh = setTimeout(function() {
        currentMatrix = $("#master-cube").css("-webkit-transform");
        if (currentMatrix == "none")
        currentMatrix = "";
      }, 1050);
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}