
Template.gifts.events({
  'click #gifts li': function(evt) {
    var gift = Gifts.findOne({_id: this._id});

    // remove the user from this gift
    if (_.contains(gift.recipients, Meteor.user().profile.name))
      Gifts.update(this._id, {$inc: {count: -1}, $pull: {recipients: Meteor.user().profile.name}});

    // add the user to this gift, but remove the user from all other gifts
    else {
      Gifts.update({}, {$pull: {recipients: Meteor.user().profile.name}}, {multi: true});
      Gifts.update(this._id, {$inc: {count: 1}, $push: {recipients: Meteor.user().profile.name}});
      Email.send({
        from: "rahul@q42.nl",
        to: ["chris@q42.nl", "rahul@q42.nl"],
        subject: "You picked a gift with Cube42!",
        text: "This is a notification to let you know that " + Meteor.user().profile.name + " just picked '" + this.name + "'. Alright, excellent! Party on, Wayne!"
      })
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
  return _.contains(this.recipients, Meteor.user().profile.name);
}
Template.giftItem.rendered = function() {
  var gift = Gifts.findOne({recipients: Meteor.user().profile.name});
  if (!gift) return;

  var name = gift.name;
  if (name[0] != "M") name[0].toLowerCase() + name.substring(1);
  var hails = ["Great", "Awesome", "Excellent", "Wicked", "Wizard", "Cool", "Dope", "Nice", "OK", "Fantastic", "Alright", "Thanks", "Dude"];
  var type = "a";
  if (name.indexOf("2") > -1)
    type = "";

  $("#gifts h2").text(hails[~~(Math.random() * hails.length)] + "! We'll send you " + type + " " + name);
}