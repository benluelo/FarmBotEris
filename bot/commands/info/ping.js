/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("ping", (message, _args, _userdata) => {
    const startTime = Date.now()
    const e = new bot.Embed().success("Pinging...")
    message.send(e)
      .then((msg) => {
        msg.edit({
          ...e.setDescription("Pong! " + (Date.now() - startTime) + "ms.")
        })
      })
  }, {
    description: "To view the time response from the bot to discord",
    usage: "​farm ping",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 1000,
    requiresUser: false
  })
}