Template.unlockGift.active = function() {
  var user = Meteor.user();
  if (!user) return;
  return user.maxLevelReached > 1 ? "active" : "";
}
Template.unlockGift.label = function() {
  if (!Meteor.user() || !Meteor.user().profile) return;
  var hasGift = Gifts.find({recipients: Meteor.user().profile.name}).fetch().length > 0;
  if (hasGift)
    return "Gift selected! Thanks!";
  else
    return "Claim your Christmas gift!";
}
Template.unlockGift.events({
  'mouseenter .unlock-button': function(evt) {
    if (Meteor.user() && Meteor.user().maxLevelReached < 2)
      $(evt.target).text("Reach level 2 to unlock!");
  },
  'mouseleave .unlock-button': function(evt) {
    if (Meteor.user() && Meteor.user().maxLevelReached < 2) {
      var hasGift = Gifts.find({recipients: Meteor.user().profile.name}).fetch().length > 0;
      if (hasGift)
        $(evt.target).text("Gift selected! Thanks!");
      else
        $(evt.target).text("Claim your Christmas gift!");
    }
  },
  'click .unlock-button.active': function() {
    showGifts();
  }
})