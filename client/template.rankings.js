

Template.rankings.users = function() {
  return Meteor.users.find({}, {sort: {maxLevelReached: -1}});
}