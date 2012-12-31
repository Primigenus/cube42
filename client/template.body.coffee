Template.body.events
  "click .cube": (evt) ->
    $el = $(evt.target).parents ".cube"
    return unless $el.hasClass "removed"

    $el.toggleClass "clicked"

    num = Session.get "numToggledCubes"
    if $el.hasClass "clicked" then num++ else num--
    Session.set "numToggledCubes", num

    if num > level
      $el.toggleClass "clicked"
      Session.get "numToggledCubes", num - 1

    calcFaces $(evt.target).text()
