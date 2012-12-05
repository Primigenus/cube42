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

  function calcFaces() {
    var results = {front: calcFront(), back: calcBack(), left: calcLeft(), right: calcRight(), top: calcTop(), bottom: calcBottom()};
    var str = "";
    for (var face in results) {
      //str = str.substr(0, str.length - 3) + " = " + _.reduce(results[face], function(x,y) {return x+y;}, 0) + "<br/>";
      str += "<span class='face "+face+"'>" + _.reduce(results[face], function(x,y) { return x+y;}, 0) + "</span>";
    }
    $("#total").html(str);
  }

  Meteor.startup(function() {
    var light = new Photon.Light(0, 0, 100);
    var currentMatrix = "";
    var toh;

    $("figure").each(function(i, el) {
      $(el).text(1+ ~~(Math.random() * 9));
    });

    $(".cube").each(function(i, el) {
      if (Math.random() < 0.3)
        $(el).toggleClass("clicked");
    })

    calcFaces();

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