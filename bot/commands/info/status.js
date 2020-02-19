const ms = require("parse-ms")
const si = require("systeminformation")
const { Embed } = require("../../lib/classes")

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// get system info
let systemInfo = {}
setInterval( async () => {
  systemInfo.mem = `${formatBytes(await si.mem().then(data => data.used))} : ${formatBytes(await si.mem().then(data => data.total))}`
  systemInfo.cpu = `${Math.round(await si.currentLoad().then(data => data.currentload))}%`
}, 10000)

exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("status", async (message, args) => {

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
      .setThumbnail(bot.user.avatarURL)

      .addField("Total Servers", `\`${bot.guilds.size}\``, true)
      .addField("Shards", `\`${bot.shards.size}\``, true)
      .addField("Online Users", `\`${onlineUsers}\``, true)

      .addField("Uptime", `\`${uptime.days} days, ${uptime.hours}:${uptime.minutes}:${uptime.seconds}\``, true)
      .addField("Connected Since", `\`${readySince.toLocaleString()}\``, true)
      .addBlankField(true)

      .addField("SYS Cpu", `\`${systemInfo.cpu}\``, true)
      .addBlankField(true)
      .addField("SYS Mem", `\`${systemInfo.mem}\``, true)

      .addField("Debug Mode", debugMode, true)
      .addBlankField(true)
      .addField("Development Mode", developmentMode, true)

    await bot.createMessage(message.channel.id, statusEmbed.show())
  }, bot.cooldown(30000))
}