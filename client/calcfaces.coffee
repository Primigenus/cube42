calcFaces = ->
  results = getFaces()
  count42 = 0
  _.each results, (face, id) ->
    total = _.reduce face, (x, y) ->
      x + 1*y.text()
    , 0
    count42++ if total is 42
    Session.set "total#{id}", total
    console.log "Session.set", "total#{id}", total

  # solved! 
  # if we disable the line, we've succesfully hacked the game
  nextLevel() if count42 is 6

getFaces = ->
  front: calcFront()
  back: calcBack()
  left: calcLeft()
  right: calcRight()
  top: calcTop()
  bottom: calcBottom()

isClicked = (x, y, z) ->
  getCube(x, y, z, "cube").hasClass "clicked"

addCube = (arr, x, y, z, type) ->
  arr.push getCube(x, y, z, type)

calcFront = ->
  total = []
  for x in [0..2]
    for y in [0..2]
      for z in [0..2]
        unless isClicked x, y, z
          addCube total, x, y, z, "front"
          break
  total

calcBack = ->
  total = []
  for x in [0..2]
    for y in [0..2]
      for z in [2..0]
        unless isClicked x, y, z
          addCube total, x, y, z, "back"
          break
  total

calcTop = ->
  total = []
  for x in [0..2]
    for z in [0..2]
      for y in [0..2]
        unless isClicked x, y, z
          addCube total, x, y, z, "top"
          break
  total

calcBottom = ->
  total = []
  for x in [0..2]
    for z in [0..2]
      for y in [2..0]
        unless isClicked x, y, z
          addCube total, x, y, z, "bottom"
          break
  total

calcLeft = ->
  total = []
  for z in [0..2]
    for y in [0..2]
      for x in [0..2]
        unless isClicked x, y, z
          addCube total, x, y, z, "left"
          break
  total

calcRight = ->
  total = []
  for z in [0..2]
    for y in [0..2]
      for x in [2..0]
        unless isClicked x, y, z
          addCube total, x, y, z, "right"
          break
  total