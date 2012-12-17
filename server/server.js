
Meteor.startup(function() {

  Meteor.publish("maxLevelReached", function () {
    return Meteor.users.find(
      {},
      {fields: {maxLevelReached: 1}}
    );
  });

  Meteor.methods({
    setMaxLevel: function(maxLevel) {
      if (!maxLevel || parseInt(maxLevel) === NaN)
        throw new Error("Invalid argument.");

      if (Meteor.user().maxLevelReached + 1 != maxLevel)
        return false;

      Meteor.users.update(this.userId, {$set: {maxLevelReached: maxLevel + 1}});

      return true;
    }
  });

  Accounts.onCreateUser(function (options, user) {
    user.maxLevelReached = 1;
    if (options.profile) user.profile = options.profile;
    return user;
  });

});