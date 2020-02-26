const versionNumber = require("../../../package").version
const ms = require("parse-ms")

exports.run = (bot) => {
  bot.registerCommand("botinfo", (message) => {
    const botCreation = bot.ownersIDs.includes(message.author.id) ? `${new Date(bot.user.createdAt).toUTCString()}` : bot.user.createdAt
    const botUptime = bot.ownersIDs.includes(message.author.id) ? `${ms(bot.uptime).days}d ${ms(bot.uptime).hours}h ${ms(bot.uptime).minutes}m ${ms(bot.uptime).seconds}s` : bot.uptime
    const infoEmbed = new bot.embed()
      .setColor(bot.color.darkgreen)
      .setThumbnail(bot.user.avatarURL)
      .addField(":date: Created On:", botCreation)
      .addField(":hourglass: Uptime", botUptime)
      .addField(":rosette: Version:", versionNumber)
    message.send(infoEmbed)
  }, bot.cooldown(3000)
  )
}