if (Meteor.isClient) {

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (callback, element) {
        window.setTimeout(function () {
          callback(+new Date);
        }, 10);
      };
  })();

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
    for (var face in results) {
      //str = str.substr(0, str.length - 3) + " = " + _.reduce(results[face], function(x,y) {return x+y;}, 0) + "<br/>";
      str += "<span class='face "+face+"'>" + _.reduce(results[face], function(x,y) { return x + 1*y.text();}, 0) + "</span>";
    }
    $("#total").html(str);
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
    
    // get a random list of cubes with length difficulty
    var cubes = [];
    for (var i = 0; i < 3 * 3 * 3; i++)
      if (i != centerCube)
        cubes.push(i);
    while (cubes.length > difficulty)
      cubes.splice(~~(Math.random() * cubes.length), 1);
    
    // and turn those off
    for (var i = 0; i < cubes.length; i++)
      $($(".cube")[cubes[i]]).toggleClass("clicked");
    
    // write a solution on the visible faces
    var faces = getFaces();
    var solutions = {
      9 : [[1,2,3,4,5,6,7,7,7], [1,2,3,4,5,6,7,8,6]],
      8 : [[1,2,4,5,6,7,8,9], [1,3,3,5,6,7,8,9]],
      7 : [[3,4,5,6,7,8,9], [3,1,8,6,7,8,9]],
      6 : [[5,6,7,7,8,9]]
    };
    for (var id in faces)
    {
      var face = faces[id];
      var sols = solutions[face.length];
      var sol = sols[~~(Math.random() * sols.length)].concat([]);
      for (var i = 0; i < face.length; i++)
      {
        var p = ~~(Math.random() * sol.length);
        face[i].text(sol.splice(p, 1)[0]);
      }
    }

    resetCube();
    calcFaces();
  }

  Meteor.startup(function() {
    var light = new Photon.Light(0, 0, 100);
    var currentMatrix = "";
    var toh;

    $("figure").each(function(i, el) {
      $(el).text(1+ ~~(Math.random() * 9));
    });

    makePuzzle(3);
    
    var faceGroup = new Photon.FaceGroup($("#master-cube")[0], $("figure"), .6, .2, true);
    faceGroup.render(light, true);
/*
    function rotateLight() {
      light.moveTo(Math.sin(new Date() / 1000) * 300, 0, 100);
      faceGroup.render(light, true, true, true);
      requestAnimFrame(rotateLight);
    }
    requestAnimFrame(rotateLight);
*/
    $(document).mousemove(function(e) {
      $("#container").css("-webkit-perspective", Math.max(300, e.clientX) + "px");
      //$("#master-cube").css("-webkit-transform", "translateZ(" + ~~(-e.clientY/10) + "px) rotateY(" + ~~(e.clientY/3) + "deg)");
    });

    $(document).keyup(function(e) {
      var key = e.which;
      var rotation = "";

      clearTimeout(toh);

      if (e.which == 37) // left
        currentMatrix = "rotate3d(0, 1, 0, 90deg) " + currentMatrix;
      else if (e.which == 39) // right
        currentMatrix = "rotate3d(0, 1, 0, -90deg) " + currentMatrix;
      else if (e.which == 38) // up
        currentMatrix = "rotate3d(1, 0, 0, -90deg) " + currentMatrix;
      else if (e.which == 40) // down
        currentMatrix = "rotate3d(1, 0, 0, 90deg) " + currentMatrix;

      $("#master-cube").css("-webkit-transform", currentMatrix);

      toh = setTimeout(function() {
        if (currentMatrix == "none")
          currentMatrix = "";

        currentMatrix = $("#master-cube").css("-webkit-transform");
        faceGroup.render(light, true, true, true);

      }, 1050);
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}