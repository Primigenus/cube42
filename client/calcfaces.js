function addCube(arr, x, y, z, type) {
  var text = getCube(x, y, z, type).text();
  arr.push(text*1 || 0);
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