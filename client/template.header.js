Template.header.currLevel = function() {
  return Session.get("level");
}
Template.header.subLevel = function() {
  return Session.get("subLevel");
}

Template.header.events({
  "click [data-role='reload-level']": function() {
    reloadLevel();
  }
});
Template.header.toggledCubes = function() {
  var num = Session.get("numToggledCubes") * 1;
  var level = Session.get("level") * 1;
  var result = [];
  for (var i = 0; i < level; i++)
    result.push({active: i < num? "active" : ""});
  return result;
}