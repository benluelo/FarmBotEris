const versionNumber = require("../../package").version
exports.run = (bot) => {
  bot.registerCommand("botinfo", (message) => {
    const infoEmbed = {
      embed: {
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        color: 0x004C00,
        fields: [
          {
            name: ":date: Created On",
            value: bot.user.createdAt
          },
          {
            name: ":hourglass: Uptime",
            value: bot.uptime
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