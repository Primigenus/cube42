
Template.gifts.events({
  'click #gifts li': function(evt) {
    var user = Meteor.user();
    if (!user)
      return false;

    var gift = Gifts.findOne({_id: this._id});

    // remove the user from this gift
    if (_.contains(gift.recipients, user.profile.name))
      Gifts.update(this._id, {$inc: {count: -1}, $pull: {recipients: user.profile.name}});

    // add the user to this gift, but remove the user from all other gifts
    else {
      Gifts.update({}, {$pull: {recipients: user.profile.name}}, {multi: true});
      Gifts.update(this._id, {$inc: {count: 1}, $push: {recipients: user.profile.name}});
      //Meteor.call("sendGiftEmail", Meteor.user().profile.name, this.name);
    }
    $(evt.target).toggleClass("selected");
  }
});

Template.gifts.items = function() {
  return Gifts.find();
}

// did this user already select this gift?
Template.giftItem.isSelected = function() {
  if (!this.recipients) return false;
  var user = Meteor.user();
  if (!user) return false;
  return _.contains(this.recipients, user.profile.name);
}
Template.giftItem.rendered = function() {
  var user = Meteor.user();
  if (!user) return;
  var gift = Gifts.findOne({recipients: user.profile.name});
  if (!gift) return;

  var hails = ["Great", "Awesome", "Excellent", "Wicked", "Wizard", "Cool", "Dope", "Nice", "OK", "Fantastic", "Alright", "Thanks", "Dude"];
  var hail = hails[~~(Math.random() * hails.length)];

  var name = gift.name;
  if (name[0] != "M") name[0].toLowerCase() + name.substring(1);
  var type = "a";
  if (name.indexOf("2") > -1)
    type = "";

  $("#gifts h2").text(hail + "! We'll send you " + type + " " + name);
}