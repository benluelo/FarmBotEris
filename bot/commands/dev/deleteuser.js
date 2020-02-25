exports.run = (bot) => {
  if ("true" == process.env.DEVELOPMENT) {
    bot.registerCommand("deleteuser", (message) => {
      if (!message.mentions[0]) {
        // delete your own account
        const deleteUserEmbed = new bot.embed().error(`**${message.author.username} (${message.author.id})**, account has been deleted`)

        bot.database.Userdata.deleteOne({ userID: message.author.id })
        message.sendMessage(deleteUserEmbed)
      } else {
        // delete someones elses account
        const userToDelete = message.mentions[0]
        const deleteUserEmbed = new bot.embed().error(`**${userToDelete.username} (${userToDelete.id})**, account has been deleted`)

        bot.database.Userdata.deleteOne({ userID: userToDelete.id })
        message.sendMessage(deleteUserEmbed)
      }
    }, {
      requirements: {
        userIDs: bot.ownersIDs
      }
    })
  }
}