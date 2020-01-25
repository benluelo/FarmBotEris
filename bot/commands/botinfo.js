const versionNumber = require("../../package").version
const ms = require("parse-ms")
exports.run = (bot) => {
  bot.registerCommand("botinfo", (message) => {
    const botCreateion = (message.author.id == bot.ownersIDS[0] || message.author.id == bot.ownersIDS[1]) ? `${new Date(bot.user.createdAt).toUTCString()}` : bot.user.createdAt
    const botUptime = (message.author.id == bot.ownersIDS[0] || message.author.id == bot.ownersIDS[1]) ? `${ms(bot.uptime).days}d ${ms(bot.uptime).hours}h ${ms(bot.uptime).minutes}m ${ms(bot.uptime).seconds}s` : bot.uptime
    const infoEmbed = {
      embed: {
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        color: bot.color.darkgreen,
        thumbnail: {
          url: bot.user.avatarURL
        },
        fields: [
          {
            name: ":date: Created On",
            value: botCreateion
          },
          {
            name: ":hourglass: Uptime",
            value: botUptime
          },
          {
            name: ":rosette: Version",
            value: versionNumber
          }
        ]
      }
    }
    bot.createMessage(message.channel.id, infoEmbed)
  }, bot.cooldown(10000)
  )
}