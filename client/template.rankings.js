
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
  return this.profile.name == Meteor.user().profile.name;
}