Template.message.loading = -> if Session.equals("loading", yes) then "loading" else ""
Template.message.text = -> messages[Session.get "message"]
Template.message.hasMessage = -> Session.get "message"
Template.message.currLevel = -> Session.get "level"
Template.message.subLevel = -> Session.get "subLevel"

Template.message.rendered = -> $("#messageContainer").show()

Template.message.events
  "click #messageContainer, click .message": ->
    unless Session.equals "loading", yes
      $("#messageContainer").hide()