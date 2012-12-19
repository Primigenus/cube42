
Meteor.startup(function() {

  var gifts = new Meteor.Collection("gifts");

  // publish maxLevelReached property for all users
  Meteor.publish("maxLevelReached", function () {
    return Meteor.users.find(
      {},
      {fields: {maxLevelReached: 1}}
    );
  });

  Meteor.methods({
    // update maxlevel from the client, but only allow it to update the value +1 higher than it already has (for security purposes)
    setMaxLevel: function(maxLevel) {
      if (!maxLevel || parseInt(maxLevel) === NaN)
        throw new Error("Invalid argument.");

      if (Meteor.user().maxLevelReached + 1 != maxLevel || maxLevel >= 5)
        return false;

      Meteor.users.update(this.userId, {$set: {maxLevelReached: maxLevel}});

      return true;
    }
  });

  // set the property when we initially create the user
  Accounts.onCreateUser(function (options, user) {
    user.maxLevelReached = 1;
    if (options.profile) user.profile = options.profile;
    return user;
  });

});