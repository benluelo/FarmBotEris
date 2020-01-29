const versionNumber = require("../../package").version
const ms = require("parse-ms")

exports.run = (bot) => {
  bot.registerCommand("botinfo", (message) => {
    const botCreation = bot.ownersIDS.includes(message.author.id)? `${new Date(bot.user.createdAt).toUTCString()}`: bot.user.createdAt
    const botUptime = bot.ownersIDS.includes(message.author.id)? `${ms(bot.uptime).days}d ${ms(bot.uptime).hours}h ${ms(bot.uptime).minutes}m ${ms(bot.uptime).seconds}s`: bot.uptime
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
            value: botCreation
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
  }, bot.cooldown(15000)
  )
}