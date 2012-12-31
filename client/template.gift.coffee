Template.unlockGift.active = ->
  if Meteor.user()?.maxLevelReached > 1 then "active" else ""

Template.unlockGift.label = ->
  hasGift = Gifts.find(recipients: Meteor.user()?.profile?.name).count() > 0
  if hasGift then return "Gift selected! Thanks!" else return "Claim your Christmas gift!"

Template.unlockGift.events
  "mouseenter .unlock-button": (evt) ->
    if Meteor.user()?.maxLevelReached < 2
      $(evt.target).text "Reach level 2 to unlock!"

  "mouseleave .unlock-button": (evt) ->
    return unless Meteor.user()?.maxLevelReached < 2

    hasGift = Gifts.find(recipients: Meteor.user()?.profile?.name).count() > 0
    if hasGift then $(evt.target).text("Gift selected! Thanks!") else $(evt.target).text("Claim your Christmas gift!")

  "click .unlock-button:active": ->
    showGifts()