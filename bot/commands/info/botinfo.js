const versionNumber = require("../../../package").version
const ms = require("parse-ms")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("botinfo", (message) => {
    const botCreation = new Date(bot.user.createdAt).toUTCString()
    const botUptime =`${ms(bot.uptime).days}d ${ms(bot.uptime).hours}h ${ms(bot.uptime).minutes}m ${ms(bot.uptime).seconds}s`
    const infoEmbed = new bot.Embed()
      .setColor(bot.color.darkgreen)
      .setThumbnail(bot.user.avatarURL)
      .addField(":date: Created On:", botCreation)
      .addField(":hourglass: Uptime", botUptime)
      .addField(":rosette: Version:", versionNumber)
    message.send(infoEmbed)
  }, {
    description: "Show general information about the bot.",
    usage: "​farm botinfo",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.UTILITY,
    cooldown: 3000
  })
}