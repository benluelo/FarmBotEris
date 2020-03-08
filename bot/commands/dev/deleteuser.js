/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.addCommand("deleteuser", (message) => {
    if (!message.mentions[0]) {
      // delete your own account
      const deleteUserEmbed = new bot.Embed().uhoh(`**${message.author.username} (${message.author.id})**, account has been deleted`)

      bot.database.Userdata.deleteOne({ userID: message.author.id })
      message.send(deleteUserEmbed)
    } else {
      // delete someones elses account
      const userToDelete = message.mentions[0]
      const deleteUserEmbed = new bot.Embed().uhoh(`**${userToDelete.username} (${userToDelete.id})**, account has been deleted`)

      bot.database.Userdata.deleteOne({ userID: userToDelete.id })
      message.send(deleteUserEmbed)
    }
  }, {
    description: "Delete a user from the database.",
    usage: "farm deleteuser [@mention]",
    examples: false,
    permissionLevel: bot.PERMISSIONS.DEVELOPMENT,
    category: bot.CATEGORIES.DEVELOPMENT,
    aliases: null,
    cooldown: 0,
    subcommands: null
  })
}