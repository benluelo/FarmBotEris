exports.run = (bot) => {
  if ("true" == process.env.DEVELOPMENT) {
    bot.registerCommand("deleteuser", (message) => {
      if (!message.mentions[0]) {
        // delete your own account
        const deleteUserEmbed = new bot.embed()
          .setDescription(`**${message.author.username} (${message.author.id})**, account has been deleted`)
          .setColor(bot.color.success)

        bot.database.Userdata.deleteOne({ userID: message.author.id })
        bot.createMessage(message.channel.id, deleteUserEmbed)
      } else {
        // delete someones elses account
        const userToDelete = message.mentions[0]
        const deleteUserEmbed = new bot.embed()
          .setDescription(`**${userToDelete.username} (${userToDelete.id})**, account has been deleted`)
          .setColor(bot.color.success)

        bot.database.Userdata.deleteOne({ userID: userToDelete.id })
        bot.createMessage(message.channel.id, deleteUserEmbed)
      }
    }, {
      requirements: {
        userIDs: bot.ownersIDs
      }
    })
  }
}