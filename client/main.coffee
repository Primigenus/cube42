messages = [
  # 1
  "Level 1 has five puzzles. Complete each one by hiding a single cube."
  "Nice work. 4 more puzzles to go until level 2!"
  "3 more! Tip: if only one square lights up it's probably the center cube."
  "Now you're thinking with cubes."
  "Almost there just one more!"

  # 2
  "Good job! Now complete four puzzles by hiding two cubes."
  "You're pretty good at this! Now do 3 more."
  "Have you ever considered becoming a professional puzzle solver? Keep going!"
  "One more until you unlock your gifts!"

  # 3
  "Getting harder yet? Next up: solve three puzzles using three cubes at a time."
  "PROTIP: To defeat the Cyberdemon shoot at it until it dies."
  "Yes! You're nearly to level 4! Only hardcore people who really want the bonus reward go there."

  # 4
  "The final level! Can you solve two puzzles using four cubes?"
  "This is it! Solve this one and you're entered for the bonus reward!"

  # beat the game!
  "Wow! You beat the game! You've been entered to win the bonus prize great job!"
]
level = 0
subLevel = 0
instruction = 0
currentMatrix = ""
centerCube = 1 + 3 + 9
onCubes = null
offCubes = null
TRIES_LEVEL = [5, 4, 3, 2]
triesEachLevel = 1
dragStartData = null
puzzleGenerationAttempts = 42
t0 = 1 * new Date()
state = {}
shuffles = []
cubeEffects = {}
Gifts = new Meteor.Collection "gifts"

Meteor.startup ->
  console.log "Initializing cube 42..."

  unless navigator.userAgent.match /chrome/i
    showBrowserMessage()
    return

  if Meteor.user()
    lastLevel = Meteor.user().lastLevel
    if lastLevel
      Session.set "level", lastLevel.split("-")[0]
      Session.set "subLevel", lastLevel.split("-")[1]
  else
    Session.set "level", level
    Session.set "subLevel", subLevel

  Meteor.subscribe "gifts"
  Meteor.subscribe "all_users"
  Meteor.subscribe "extra_fields"

  Session.set "message", -2
  Session.set "numToggledCubes", 0
  Session.set "loading", no

  $(".cube").each (i, el) ->
    $(el).attr "data-nr", i
    setCubeValue $(el), 1+ ~~(Math.random() * 9)

  nextLevel()

  Meteor.setInterval fixOrientation, 500

  attachEventListeners()

attachEventListeners = ->
  window.onbeforeunload = ->
    unless Meteor.user()
      return "Are you sure you want to leave the page? You'll have to start over from 1-1!"

  $(document).keyup (e) ->
    Meteor.clearTimeout toh
    currentMatrix = "" if currentMatrix is "none"

    dir = e.which

    if dir is 37 then currentMatrix = "rotate3d(0,1,0,-90deg) #{currentMatrix}"
    if dir is 39 then currentMatrix = "rotate3d(0,1,0,90deg)  #{currentMatrix}"
    if dir is 38 then currentMatrix = "rotate3d(1,0,0,90deg)  #{currentMatrix}"
    if dir is 40 then currentMatrix = "rotate3d(1,0,0,-90deg) #{currentMatrix}"

    if dir in [37, 39, 38, 40]
      $("#master-cube").css "-webkit-transform", currentMatrix

      toh = Meteor.setTimeout ->
        currentMatrix = $("#master-cube").css "-webkit-transform"
      , 1050

  $(document).mousedown (evt) ->
    dragStartData =
      x: evt.pageX
      y: evt.pageY
      matrix: $("#master-cube").css "-webkit-transform"
      transition: $("#master-cube").css "-webkit-transition"
    $("#master-cube").css "-webkit-transition", "none"

  $(document).mouseup (evt) ->
    evt.stopPropagation() # prevent click
    if dragStartData
      $("#master-cube").css "-webkit-transition", dragStartData.transition
    dragStartData = null

  $(document).mousemove (evt) ->
    return unless dragStartData

    dragStartData.matrix = "" if dragStartData.matrix is "none"
    deltaX = evt.pageX - dragStartData.x
    deltaY = evt.pageY - dragStartData.y
    len = Math.sqrt deltaX * deltaX + deltaY * deltaY
    $("#master-cube").css "-webkit-transform", "rotate3d(#{-deltaY},#{deltaX},0,#{len/5}deg)#{dragStartData.matrix}"
    currentMatrix = $("#master-cube").css "-webkit-transform"

showFace = (face) ->
  switch face
    when "front" then transform = "0,0,0,0"
    when "back" then transform = "1,0,0,180deg"
    when "left" then transform = "0,1,0,90deg"
    when "right" then transform = "0,1,0,-90deg"
    when "top" then transform = "1,0,0,-90deg"
    when "bottom" then transform = "1,0,0,90deg"
  currentMatrix = "rotate3d(#{transform})"
  $("#master-cube").css "-webkit-transform", currentMatrix

fixOrientation = ->
  matrix = $("#master-cube").css "-webkit-transform"
  m = matrix.match /^matrix3d\((.*)\)$/
  return unless m
  matrix = m[1].split ", "

  x = 1 * matrix[1]
  y = 1 * matrix[5]
  angle = if Math.abs(y) > Math.abs(x) then (if y > 0 then 0 else 180) else (if x > 0 then -90 else 90)
  $(".front span").css "-webkit-transform", "rotate(#{angle}deg)"
  angle = if Math.abs(y) > Math.abs(x) then (if y > 0 then 0 else 180) else (if x > 0 then 90 else -90)
  $(".back span").css "-webkit-transform", "rotate(#{angle}deg)"

  x = 1 * matrix[4]
  y = 1 * matrix[5]
  angle = if Math.abs(y) > Math.abs(x) then (if y > 0 then 0 else 180) else (if x > 0 then 90 else -90)
  $(".left span, .right span").css "-webkit-transform", "rotate(#{angle}deg)"

  x = 1 * matrix[0]
  y = 1 * matrix[1]
  angle = if Math.abs(y) > Math.abs(x) then (if y > 0 then -90 else 90) else (if x > 0 then 0 else 180)
  $(".bottom span").css "-webkit-transform", "rotate(#{angle}deg)"
  angle = if Math.abs(y) > Math.abs(x) then (if y > 0 then 90 else -90) else (if x > 0 then 0 else 180)
  $(".top span").css "-webkit-transform", "rotate(#{angle}deg)"

nextMessage = ->
  Session.set "message", Session.get("message") + 1

nextLevel = ->
  Meteor.defer ->
    triesEachLevel--

    nextMessage()

    startingNewLevel = no
    if triesEachLevel is 0
      level++
      subLevel = 1

      # there is no level 5. restart the game
      if level is 5
        Meteor.call "setMaxLevel", level
        level = 1
        Session.set "message", 0

      Session.set "level", level
      triesEachLevel = TRIES_LEVEL[level - 1]
      startingNewLevel = yes
      onCubes = mkShuffled 0, 3 * 3 * 3 - 1, centerCube
      offCubes = [centerCube]

    else
      subLevel++

    Meteor.call "saveLastLevel", level, subLevel

    Session.set "subLevel", subLevel
    Session.set "numToggledCubes", 0
    Session.set "loading", yes

    Meteor.defer ->
      if startingNewLevel
        Meteor.call "setMaxLevel", level
        $(".cube").removeClass "removed"
        $(".cube").removeClass "clicked"
      makePuzzle level
      resetView()

resetView = -> $("#master-cube").css "-webkit-transform", ""
getCube = (x, y, z, type) -> $($(".#{type}")[x + 3*y + 9*z])

reloadLevel = ->
  $(".cube").removeClass "clicked"
  Session.set "numToggledCubes", 0
  Session.set "loading", yes
  onCubes = mkShuffled 0, 3 * 3 * 3 - 1, centerCube
  offCubes = [centerCube]
  Meteor.defer ->
    makePuzzle level
    resetView()

play = ->
  $("#start").hide()
  resetView()
  $(document.body).removeClass "instructions"
  nextMessage()
  spinCube()

showRankings = ->
  $("#start, #messageContainer").hide()
  $("#rankings").show()
  $(document.body).addClass "rankings"

showGifts = ->
  $("#start, #messageContainer").hide()
  $("#gifts").show()
  $(document.body).addClass "gifts"

showBrowserMessage = ->
  $("#browser-message").show()
  $("#start").hide()

showInstructions = ->
  $("#start, #messageContainer").hide()
  resetView()
  spinCube()
  $(document.body).addClass "instructions"
  instruction = 0
  showInstruction instruction

showInstruction = (i) ->
  $("#instructions li").hide()

  inst = $("#instructions li")[i]
  unless inst
    $(document.body).removeClass "instructions"
    $("#start").show()
    return

  $(inst).show()

  # specific actions to execute when showing an instruction
  switch i
    when 3 then $($(".cube")[3]).addClass "clicked"
    when 5
      $($(".cube")[3]).removeClass "clicked"
      showFace "left"
      Meteor.setTimeout ->
        showFace "front"
      , 1800
    when 7
      Session.set "numToggledCubes", 1
      Meteor.setTimeout ->
        Session.set "numToggledCubes", 0
      , 1000

makePuzzle = (difficulty) ->
  console.log "Create level", difficulty, "puzzle"

  # remove center cube
  $($(".cube")[centerCube]).addClass "clicked"

  # Really remove the off cubes from the last puzzle
  $($(".cube")[offCubes[i]]).addClass "removed" for i in [0...offCubes.length]

  # Choose new set of cubes to turn off
  offCubes = onCubes.splice 0, difficulty

  # and turn those off
  $($(".cube")[offCubes[i]]).toggleClass "clicked" for i in [0...offCubes.length]

  return tryPuzzle()

tryPuzzle = ->
  console.log "Attempting to generate..."
  puzzleGenerationAttempts--

  if puzzleGenerationAttempts is 0
    window.location.reload() if confirm "Can't create a puzzle. Reload?"
    puzzleGenerationAttempts = 42
    return

  faces = getFaces()
  state = {}
  cubeEffects = {}
  _.each faces, (face, id) ->
    state[id] = sum: 0, emptyCount: face.length
    for i in [0...face.length]
      cubeid = face[i].parent().attr "data-nr"
      cubeEffects[cubeid] = cubeEffects[cubeid] || []
      cubeEffects[cubeid].push id

  # set others to zero
  shuffles = []
  shuffles[i] = mkShuffled 1, 9 for i in [0...onCubes.length]

  t0 = 1 * new Date()
  try
    unless findSolution 0
      window.location.reload() if confirm "Can't create a puzzle. Reload?"
      return

    $($(".cube")[offCubes[i]]).toggleClass "clicked" for i in [0...offCubes.length]

    calcFaces()

    console.log "Done."
    puzzleGenerationAttempts = 42
    Session.set "loading", no
  catch e
    Meteor.defer tryPuzzle

findSolution = (depth) ->
  throw "too slow" if new Date() - t0 > 300
  return false unless isStillPossible state
  return true if depth is onCubes.length # found a valid puzzle!

  cubeid = onCubes[depth]
  shuffled = shuffles[depth]

  for i in [0...9]
    # try a value
    updateState cubeid, shuffled[i]
    if findSolution depth + 1
      # it worked, set it
      setCubeValue $($(".cube")[cubeid]), shuffled[i]
      return true

    # undo it
    resetState cubeid, shuffled[i]

  return false

updateState = (cubeid, value) ->
  for effect in cubeEffects[cubeid]?
    s = state[effect]
    s.sum += value
    s.emptyCount--

resetState = (cubeid, value) ->
  for effect in cubeEffects[cubeid]?
    s = state[effect]
    s.sum -= value
    s.emptyCount++

isStillPossible = (state) ->
  _.each state, (face, id) ->
    sum = face.sum
    emptyCount = face.emptyCount
    return no if sum + emptyCount * (emptyCount + 1) / 3 > 42
    return no if sum + 10 * emptyCount - emptyCount * (emptyCount + 1) / 3 < 42
  return yes

setCubeValue = ($cube, value) ->
  $cube.children().each (i, el) ->
    $(el).find("span").text value

mkShuffled = (min, max, skip) ->
  a = []
  for i in [min..max]
    if i isnt skip
      a.splice ~~(Math.random() * (a.length + 1)), 0, i
  a

spinCube = ->
  $("#master-cube").css
    "-webkit-transition-duration": "2s"
    "-webkit-transform": "rotate3d(0,1,0,360deg) #{currentMatrix}"
  Meteor.setTimeout ->
    $("#master-cube").css
      "-webkit-transition-duration": "0s"
      "-webkit-transform": "rotate3d(0,1,0,0deg) #{currentMatrix}"
    Meteor.defer ->
      $("#master-cube").css "-webkit-transition-duration", "1s"
  , 3000
