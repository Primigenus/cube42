Template.totals.faces = ->
  for face in ["front", "back", "left", "right", "top", "bottom"]
    face: face, total: Session.get "total#{face}"

Template.totals.events
  'click .face': (evt) ->
    showFace evt.target.className.split(" ")[1]