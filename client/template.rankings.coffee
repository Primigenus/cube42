Template.rankings.events
  "click [data-role='welcome']": ->
    $("#start").show()
    $("#rankings").hide()

Template.rankings.users = ->
  Meteor.users.find {}, sort: maxLevelReached: -1

Template.rankings.reachedText = ->
  if @maxLevelReached is 5 then "beat the game!" else "reached"

Template.rankings.beatGame = ->
  @maxLevelReached is 5

Template.rankings.isUser = ->
  @_id is Meteor.user()?._id