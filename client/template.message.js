Template.message.loading = function() {
  return Session.equals("loading", true) ? "loading" : "";
}
Template.message.text = function() {
  return messages[Session.get("message") * 1];
}
Template.message.rendered = function() {
  $("#messageContainer").show();
}
Template.message.hasMessage = function() {
  return !Session.equals("message", undefined);
}
Template.message.currLevel = function() {
  return Session.get("level");
}
Template.message.subLevel = function() {
  return Session.get("subLevel");
}
Template.message.events({
  'click #messageContainer': function() {
    if (!Session.equals("loading", true))
      $("#messageContainer").hide();
  },
  'click .message': function() {
    if (!Session.equals("loading", true))
      $("#messageContainer").hide();
  }
});