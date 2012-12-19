Template.unlockGift.active = function() {
  return Meteor.user().maxLevelReached > 1 ? "active" : "";
}
Template.unlockGift.events({
  'mouseenter .button': function(evt) {
    if (Meteor.user().maxLevelReached < 2)
      $(evt.target).text("Reach level 2 to unlock!");
  },
  'mouseleave .button': function(evt) {
    if (Meteor.user().maxLevelReached < 2)
      $(evt.target).text("Claim your Christmas gift!");
  },
  'click .button.active': function() {
    showGifts();
  }
})