

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

Template.message.text = function() {
  return messages[Session.get("message") * 1];
}
Template.message.rendered = function() {
  $("#messageContainer").show();
}

Template.message.hasMessage = function() {
  return !Session.equals("message", undefined);
}

Template.message.events({
  'click #messageContainer': function() {
    $("#messageContainer").hide();
  },
  'click .message': function() {
    $("#messageContainer").hide();
  }
});

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