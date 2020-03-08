const { XPProgressBar } = require("../../../lib/classes")

/** @private @param {import("../../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("village", (message, _args, userdata) => {
    const villageEmbed = new bot.Embed().setColor(bot.color.lightgreen).setTitle(`${message.author.username}'s Village!   ${userdata.region.flag}`)

    for (const farmer in userdata.farmers) {
      const progressBar = new XPProgressBar(userdata.farmers[farmer].level, 10, userdata.farmers[farmer].wealth + 2)
      villageEmbed.addField(userdata.farmers[farmer].name, userdata.farmers[farmer].emoji + " Level  **" + progressBar.level() + "**\n" + progressBar.show(), true)
    }
    message.send(villageEmbed.addBlankField(true))
  }, {
    description: "Shows you the village of all the people and their levels",
    usage: "​farm village",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000
  })
}