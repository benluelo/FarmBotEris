const ms = require("parse-ms")
const si = require("systeminformation")
const { Embed } = require("../lib/classes")

exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("status", async (message, args) => {

    // get system info
    let mainCPUTemp = await si.cpuTemperature()

    // get debug/development info
    const debugMode = (process.env.DEBUG == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"
    const developmentMode = (process.env.DEVELOPMENT == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"

    // get bot properties
    const readySince = new Date(bot.startTime)
    const uptime = ms(bot.uptime)
    const onlineUsers = bot.users.filter(user => !user.bot).length

    const statusEmbed = new Embed()
      .setTitle(`${bot.user.username} Status`)
      .setColor(bot.color.lightgreen)
      .addField("Total Servers", bot.guilds.size, true)
      .addField("Connected Since", readySince.toUTCString(), true)
      .addField("Online Users", onlineUsers, true)
      .addField("Uptime", `${uptime.days} days, ${uptime.hours}:${uptime.minutes}:${uptime.seconds}`, true)
      .addField("Shards", bot.shards.size, true)
      .addBlankField(false)
      .addField("Debug Mode", debugMode, true)
      .addBlankField(true)
      .addField("Development Mode", developmentMode, true)

    await bot.createMessage(message.channel.id, statusEmbed.show())
  }, bot.cooldown(30000))
}