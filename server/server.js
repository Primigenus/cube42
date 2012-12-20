
Meteor.startup(function() {

  var Gifts = new Meteor.Collection("gifts");

  // no docs? add some.
  if (Gifts.find().fetch().count == 0) {
    Gifts.insert({name: "Whisky", count: 0, recipients: []});
    Gifts.insert({name: "Donation to the VSN", count: 0, recipients: []});
    Gifts.insert({name: "Staatsloterij lottery ticket", count: 0, recipients: []});
    Gifts.insert({name: "2 tickets to the Stedelijk museum", count: 0, recipients: []});
    Gifts.insert({name: "1 month subscription to Pepper", count: 0, recipients: []});
    Gifts.insert({name: "2 tickets to the Rijksmuseum", count: 0, recipients: []});
    Gifts.insert({name: "MENDO book", count: 0, recipients: []});
  }

  // publish maxLevelReached property for all users
  Meteor.publish("maxLevelReached", function () {
    return Meteor.users.find(
      {},
      {fields: {maxLevelReached: 1}}
    );
  });

  Meteor.publish("extra_fields", function() {
    console.log(Meteor.users.findOne({_id: this.userId}));
    return Meteor.users.find(
      {_id: this.userId},
      {fields: {'services.facebook.email': 1, 'services.facebook.username': 1}}
    );
  });

  Meteor.methods({
    // update maxlevel from the client, but only allow it to update the value +1 higher than it already has (for security purposes)
    setMaxLevel: function(maxLevel) {
      if (!maxLevel || parseInt(maxLevel) === NaN)
        throw new Error("Invalid argument.");

      if (Meteor.user() && (Meteor.user().maxLevelReached + 1 != maxLevel || maxLevel >= 5))
        return false;

      Meteor.users.update(this.userId, {$set: {maxLevelReached: maxLevel}});

      return true;
    },
    sendGiftEmail: function(username, giftname) {
      if (Meteor.user().profile.username != username)
        return;

      Email.send({
        from: "rahul@q42.nl",
        to: ["chris@q42.nl", "rahul@q42.nl"],
        subject: username + " picked a gift with Cube42!",
        text: "This is a notification to let you know that " + username + " just picked '" + giftname + "'. Alright, excellent! Party on, Wayne!"
      });
    }
  });

  // set the property when we initially create the user
  Accounts.onCreateUser(function (options, user) {
    user.maxLevelReached = 1;
    if (options.profile) user.profile = options.profile;
    return user;
  });

});