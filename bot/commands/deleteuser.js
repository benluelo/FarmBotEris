exports.run = (bot) => {
  if (process.env.DEVELOPMENT == "true") {
    bot.registerCommand("deleteuser", (message) => {
      if (!message.mentions[0]) {
        // delete your own account
        bot.database.Userdata.deleteOne({userID: message.author.id})
        bot.createMessage(message.channel.id, `**${message.author.username}**, account has been deleted`)
      } else {
        // delete someones elses account
        const userToDelete = message.mentions[0]
        bot.database.Userdata.deleteOne({userID: userToDelete.id})
        bot.createMessage(message.channel.id, `**${userToDelete.username}**, account has been deleted`)
      }
    }, {
      requirements: {
        userIDs: bot.ownersIDS
      }
    })
  }
}