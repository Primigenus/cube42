var level = 1;
var subLevel = 1;
var instruction = 0;
var currentMatrix = "";
var messages = [
  "Complete four puzzles by toggling a single cube."
  ,"Good job! Now, complete four puzzles by toggling two cubes."
  ,"Getting harder yet? Next up: three cubes at a time."
  ,"Wow, level 4! Can you solve puzzles using four cubes?"
];
var centerCube = 1 + 3 + 9;
var onCubes = mkShuffled(0, 3 * 3 * 3 - 1, centerCube);
var offCubes = [centerCube];
var triesEachLevel = 4;

Meteor.startup(function()
{
  console.log("Initializing 42 cube...");

  Session.set("message", undefined);
  Session.set("level", level);
  Session.set("subLevel", subLevel);
  Session.set("numToggledCubes", 0);

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
  var dragStartData = null;

  $(document).keyup(function(e) {
    Meteor.clearTimeout(toh);

    if (currentMatrix == "none")
      currentMatrix = "";

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
      }, 1050);
    }
  });

  $(document).mousedown(function(evt) {
    dragStartData = {
      x: evt.pageX,
      y: evt.pageY,
      matrix: $("#master-cube").css("-webkit-transform"),
      transition: $("#master-cube").css("-webkit-transition")
    };
    $("#master-cube").css("-webkit-transition", "none")
  });

  $(document).mouseup(function(evt) {
    evt.stopPropagation(); // prevent click from activating
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
  currentMatrix = "rotate3d(" + transform + ")";
  $("#master-cube").css("-webkit-transform", currentMatrix);
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

function nextMessage()
{
  var msg = Session.get("message")*1;
  if (msg == undefined) msg = -1;
  msg++;
  Session.set("message", msg);
}

function nextLevel()
{
  Meteor.defer(function() {
    if (triesEachLevel == 0) {
      nextMessage();
      Session.set("level", level);
      triesEachLevel = 4;
    }

    Session.set("subLevel", subLevel);
    Session.set("numToggledCubes", 0);

    makePuzzle(level);

    $("#master-cube").css("-webkit-transform", "");
  });
}

function getCube(x, y, z, type)
{
  return $($("." + type)[x + 3*y + 9*z]);
}

function play()
{
  $("#start").hide();
  $("#master-cube").css("-webkit-transform", "");
  $(document.body).removeClass('instructions');
  nextMessage();
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
    $("#start").show();
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

function makePuzzle(difficulty)
{
  if (difficulty == 1)
    $($(".cube")[centerCube]).addClass("clicked");

  // Really remove the off cubes from the last puzzle
  for (var i = 0; i < offCubes.length; i++)
    $($(".cube")[offCubes[i]]).addClass("removed");

  console.log("Create level", difficulty, "puzzle");

  // Choose new set of cubes to turn off
  offCubes = onCubes.splice(0, difficulty);

  // and turn those off
  for (var i = 0; i < offCubes.length; i++)
    $($(".cube")[offCubes[i]]).toggleClass("clicked");

  return tryPuzzle();


  function tryPuzzle()
  {
    console.log("Attempting to generate...")
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
        if (confirm("Can't create a puzzle. Reload?"))
          window.location.reload();
        return;
      }

      for (var i = 0; i < offCubes.length; i++)
        $($(".cube")[offCubes[i]]).toggleClass("clicked");

      calcFaces();

      console.log("Done.")
    }
    catch(e)
    {
      // took too long, retry
      return Meteor.defer(tryPuzzle);
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