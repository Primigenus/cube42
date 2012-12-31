Template.body.events
  "click .cube": (evt) ->
    $el = $(evt.target).parents ".cube"
    return if $el.hasClass "removed"

    $el.toggleClass "clicked"

    num = Session.get "numToggledCubes"
    if $el.hasClass "clicked" then num++ else num--
    Session.set "numToggledCubes", num

    if num > level
      $el.removeClass "clicked"
      Session.set "numToggledCubes", level

    calcFaces $(evt.target).text()
