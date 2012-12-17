Template.gift.active = function() {
  return Session.get("level") > 1;
}
Template.gift.events({
  'mouseenter .button': function(evt) {
    if (level < 2)
      $(evt.target).text("Reach level 2 to unlock!");
  },
  'mouseleave .button': function(evt) {
    if (level < 2)
      $(evt.target).text("Claim your Christmas gift!");
  }
})