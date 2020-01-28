const ms = require("parse-ms")
exports.run = (bot) => {
  bot.registerCommand("status", (message, args) => {
    const onlineUsers = bot.users.filter(user => !user.bot).length
    const bugMode = (process.env.DEBUG == "true") ? ":white_check_mark: Enabled" : ":negative_squared_cross_mark: Disemabled"
    const developmentMode = (process.env.DEVELOPMENT == "true") ? ":white_check_mark: Enabled" : ":negative_squared_cross_mark: Disemabled"
    const readySince = new Date(bot.startTime)
    const uptime = ms(bot.uptime)
    const statusEmbed = {
      embed: {
        title: `${bot.user.username} Status`,
        color: bot.color.lightgreen,
        fields: [
          {
            name: "Total Servers",
            value: bot.guilds.size,
            inline: true
          },
          {
            name: "Connected Since",
            value: readySince.toUTCString(),
            inline: true
          },
          {
            name: "Online Users",
            value: onlineUsers,
            inline: true
          },
          {
            name: "Uptime",
            value: `${uptime.days} days, ${uptime.hours}:${uptime.minutes}:${uptime.seconds}`,
            inline: true
          },
          {
            name: "Shards",
            value: bot.shards.size,
            inline: true
          },
          {
            name: "Debug Mode",
            value: bugMode,
            inline: true
          },
          {
            name: "Development Mode",
            value: developmentMode,
            inline: true
          }
        ]
      }
    }
    bot.createMessage(message.channel.id, statusEmbed)
  })
}