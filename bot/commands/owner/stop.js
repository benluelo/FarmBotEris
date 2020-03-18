/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("stop", (message, _args, _userdata) => {
    const stopEmbed = new bot.Embed()
      .setTitle("Stopping Bot")
      .setDescription(`${bot.user.username} disconnecting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
      .setColor(bot.color.red)

    message.send(stopEmbed)
    setTimeout(() => { bot.disconnect(); process.exit(0) }, 5000)
  }, {
    description: "Stops the bot.",
    usage: "​farm stop",
    examples: "​farm stop",
    permissionLevel: bot.PERMISSIONS.OWNERS,
    category: bot.CATEGORIES.UTILITY,
    aliases: ["assassinate"],
    cooldown: 0
  // eslint-disable-next-line no-unused-vars
  }).subcommand("restart", (message, _args, _userdata) => {
    const restartEmbed = new bot.Embed()
      .setTitle("Restarting Bot")
      .setDescription(`${bot.user.username} restarting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
      .setColor(bot.color.red)

    message.send(restartEmbed)
    setTimeout(() => { bot.disconnect({ reconnect: "auto" }) }, 10000)
  }, {
    description: "Restarts the bot",
    usage: "​farm stop restart",
    examples: "​farm stop restart",
    permissionLevel: bot.PERMISSIONS.OWNERS,
    category: bot.CATEGORIES.UTILITY,
    aliases: ["resurect"],
    cooldown: 0
  })
}