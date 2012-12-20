
Template.rankings.events({
  "click [data-role='welcome']": function() {
    $("#start").show();
    $("#rankings").hide();
  }
})

Template.rankings.users = function() {
  return Meteor.users.find({}, {sort: {maxLevelReached: -1}});
}

Template.rankings.isUser = function() {
  var user = Meteor.user();
  if (!user) return false;
  return this._id == Meteor.user()._id;
}