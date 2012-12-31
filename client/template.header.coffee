Template.header.currLevel = -> Session.get "level"
Template.header.subLevel = -> Session.get "subLevel"

Template.header.events
  "click [data-role='reload-level']": ->
    reloadLevel()

Template.header.toggledCubes = ->
  for i in [0...Session.get "level"]
    active: if i < Session.get "numToggledCubes" then "active" else ""