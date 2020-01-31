const ms = require("parse-ms")

exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("status", (message, args) => {

    const debugMode = (process.env.DEBUG == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"
    const developmentMode = (process.env.DEVELOPMENT == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"

    const readySince = new Date(bot.startTime)
    const uptime = ms(bot.uptime)
    const onlineUsers = bot.users.filter(user => !user.bot).length

    const statusEmbed = {
      embed: {
        title: `${bot.user.username} Status`,
        color: bot.color.lightgreen,
        fields: [
          {
            name: "Connected Since",
            value: readySince.toUTCString(),
            inline: false
          },
          {
            name: "Total Servers",
            value: bot.guilds.size,
            inline: true
          },
          {
            name: "Online Users",
            value: onlineUsers,
            inline: false
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
            value: debugMode,
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
  }, bot.cooldown(30000))
}