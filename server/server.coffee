
# deploy pass: whatarewedoing

Meteor.startup ->
  Gifts = new Meteor.Collection "gifts"

  # no docs? add some
  if Gifts.find().count() is 0
    gifts = [
      "Whisky"
      "Donation to the VSN"
      "2 Staatsloterij lottery tickets"
      "2 tickets to the Stedelijk museum"
      "1 month subscription to Pepper"
      "2 tickets to the Rijksmuseum"
      "MENDO.nl book"
      "Schaatsen.nl snow cap"
      "Surprise me"
    ]

  _.each gifts, (gift) -> Gifts.insert
    name: gift
    recipients: []

  Meteor.publish "gifts", -> Gifts.find()

  Meteor.publish "all_users", ->
    Meteor.users.find {}, fields:
      'profile.name': 1
      maxLevelReached: 1

  Meteor.publish "extra_fields", ->
    Meteor.users.find _id: this.userId, fields:
      'services.facebook.email': 1
      'services.facebook.username': 1

  Meteor.methods
    # update maxlevel from the client, but only allow it to
    # update the value +1 higher than it already has
    # (for security purposes)
    setMaxLevel: (maxLevel) ->
      if not maxLevel or parseInt(maxLevel) is NaN
        throw new Error "Invalid argument."
      return if Meteor.user() and (Meteor.user().maxLevelReached + 1 isnt maxLevel or maxLevel > 5)

    saveLastLevel: (level, sublevel) ->
      return unless Meteor.user()
      Meteor.users.update this.userId, $set: maxLevelReached: maxLevel

    removeMeFromGift: (giftId, username) ->
      Gifts.update giftId, $pull: recipients: username

    addMeToGift: (giftId, username) ->
      Gifts.update {}, {$pull: recipients: username}, multi: true
      Gifts.update giftId, $push: recipients: username

  Accounts.onCreateUser (options, user) ->
    user.maxLevelReached = 1
    user.profile = options.profile if options.profile
    user