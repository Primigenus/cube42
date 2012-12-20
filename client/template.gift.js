Template.unlockGift.active = function() {
  var user = Meteor.user();
  if (!user) return;
  return user.maxLevelReached > 1 ? "active" : "";
}
Template.unlockGift.events({
  'mouseenter .unlock-button': function(evt) {
    if (Meteor.user() && Meteor.user().maxLevelReached < 2)
      $(evt.target).text("Reach level 2 to unlock!");
  },
  'mouseleave .unlock-button': function(evt) {
    if (Meteor.user() && Meteor.user().maxLevelReached < 2)
      $(evt.target).text("Claim your Christmas gift!");
  },
  'click .unlock-button.active': function() {
    showGifts();
  }
})