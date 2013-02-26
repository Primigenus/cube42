
# deploy pass: whatarewedoing

Meteor.startup ->
  Meteor.publish "all_users", ->
    Meteor.users.find {}, fields:
      'profile.name': 1
      maxLevelReached: 1
      lastLevel: 1

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
      Meteor.users.update this.userId, $set: maxLevelReached: maxLevel

    saveLastLevel: (level, sublevel) ->
      return unless Meteor.user()
      Meteor.users.update this.userId, $set: lastLevel: level

    sendFeedbackEmail: (text) ->
      return unless Meteor.user()
      Email.send
        from: Meteor.user().email
        to: "rahul@q42.nl"
        subject: "Cube42 feedback"
        text: text

  Accounts.onCreateUser (options, user) ->
    user.maxLevelReached = 1
    user.lastLevel = 1
    user.profile = options.profile if options.profile
    user