hails = ["Great", "Awesome", "Excellent", "Wicked", "Wizard", "Cool", "Dope", "Nice", "OK", "Fantastic", "Alright", "Thanks", "Dude", "Sweet", "Tubular", "Heavy"]
getHail = -> hails[~~(Math.random() * hails.length)] + "! "
hail = getHail()

userHasGift = ->
  gift = Gifts.findOne recipients: Meteor.user()?.profile?.name
  return if gift then true else false

Template.gifts.events
  "click [data-role='welcome']": ->
    $("#start").show()
    $("#gifts").hide()
  "click #gifts li": (evt) ->
    user = Meteor.user()
    return unless user

    gift = Gifts.findOne _id: @_id

    # remove user from gift
    if _.contains gift.recipients, user.profile.name
      Meteor.call "removeMeFromGift", @_id, user.profile.name

    # add user to gift, remove from all others
    else
      hail = getHail()
      Meteor.call "addMeToGift", @_id, user.profile.name

    $(evt.target).toggleClass "selected"

Template.gifts.items = -> Gifts.find()

Template.giftItem.isSelected = ->
  _.contains @recipients?, Meteor.user()?.profile.name

Template.giftTitle.hail = ->
  str = "You win! Go ahead and pick something out."

  return str unless userHasGift()

  gift = Gifts.findOne recipients: Meteor.user().profile.name
  name = gift.name
  type = "a"

  if name[0] isnt "M" then name = name[0].toLowerCase() + name.substring(1)
  if name.indexOf("2") > -1 then type = ""

  str = "We'll send you #{type} #{name}"

  if name.match /VSN/
    str = "We'll make a donation to the VSN on your behalf"
  if name.match /surprise/i
    str = "We'll surprise you"
  if name.match /whisky/i
    str = "We'll send you a bottle of whisky"

  str
