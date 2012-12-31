Template.start.rendered = ->
  $("[data-role='lettering']").lettering()

Template.start.events
  "click [data-role='play']": -> play()
  "click [data-role='instructions']": -> showInstructions()
  "click [data-role='rankings']": -> showRankings()
  "mouseenter .char1": (evt) -> $(evt.target).text "Q"
  "mouseleave .char1": (evt) -> $(evt.target).text "C"