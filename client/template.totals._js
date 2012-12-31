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
Template.totals.events({
  'click .face': function(evt) {
    showFace(evt.target.className.split(" ")[1]);
  }
});