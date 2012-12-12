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

function getFaces()
{
  return {front: calcFront(), back: calcBack(), left: calcLeft(), right: calcRight(), top: calcTop(), bottom: calcBottom()};
}

function isClicked(x, y, z) {
  return getCube(x, y, z, "cube").hasClass("clicked");
}

function addCube(arr, x, y, z, type) {
  arr.push(getCube(x, y, z, type));
}

function calcFront() {
  var total = [];
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      for (var z = 0; z < 3; z++) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "front");
          break;
        }
      }
    }
  }
  return total;
}

function calcBack() {
  var total = [];
  for (var x = 0; x < 3; x++) {
    for (var y = 0; y < 3; y++) {
      for (var z = 2; z >= 0; z--) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "back");
          break;
        }
      }
    }
  }
  return total;
}

function calcTop() {
  var total = [];
  for (var x = 0; x < 3; x++) {
    for (var z = 0; z < 3; z++) {
      for (var y = 0; y < 3; y++) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "top");
          break;
        }
      }
    }
  }
  return total;
}

function calcBottom() {
  var total = [];
  for (var x = 0; x < 3; x++) {
    for (var z = 0; z < 3; z++) {
      for (var y = 2; y >= 0; y--) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "bottom");
          break;
        }
      }
    }
  }
  return total;
}

function calcLeft() {
  var total = [];
  for (var z = 0; z < 3; z++) {
    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "left");
          break;
        }
      }
    }
  }
  return total;
}

function calcRight() {
  var total = [];
  for (var z = 0; z < 3; z++) {
    for (var y = 0; y < 3; y++) {
      for (var x = 2; x >= 0; x--) {
        if (!isClicked(x, y, z)) {
          addCube(total, x, y, z, "right");
          break;
        }
      }
    }
  }
  return total;
}