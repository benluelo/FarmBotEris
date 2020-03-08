const ms = require("parse-ms")
const si = require("systeminformation")

/**
 * @description Formats bytes.
 * @param {Number} bytes - Number of bytes.
 * @param {Number} decimals - Decimal precision. Defaults to `2`.
 * @returns {String} The formatted bytes.
 */
function formatBytes(bytes, decimals = 2) {
  if (!bytes) { return "0 Bytes" }
  const k = 1024
  const dm = 0 > decimals ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// get system info
const systemInfo = {}
setInterval( async () => {
  const os = await si.osInfo()
  systemInfo.mem = `${formatBytes(await si.mem().then((data) => data.used))} : ${formatBytes(await si.mem().then((data) => data.total))}`
  systemInfo.cpu = `${Math.round(await si.currentLoad().then((data) => data.currentload))}%`
  systemInfo.os = `${os.platform} ${os.distro} ${os.codename}#${os.release} ${os.arch}`
}, 10000)

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("status", async (message, args, userdata) => {

    // get debug/ development info
    const debugMode = (bot.ENV.DEBUG == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"
    const developmentMode = (bot.ENV.DEVELOPMENT == "true") ?
      ":white_check_mark: Enabled" :
      ":negative_squared_cross_mark: Disabled"

    // get bot properties
    const readySince = new Date(bot.startTime)
    const uptime = ms(bot.uptime)
    const onlineUsers = bot.users.filter((user) => !user.bot).length

    const statusEmbed = new bot.Embed()
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
      .addField("SYS OS", `\`${systemInfo.os}\``, true)
      .addField("SYS Mem", `\`${systemInfo.mem}\``, true)

      .addField("Debug Mode", debugMode, true)
      .addField("Development Mode", developmentMode, true)
      .addBlankField(true)

    return message.send(statusEmbed)
  }, {
    description: "The status of the bot. (more detailed version of `farm botinfo`)",
    usage: "​farm status",
    examples: false,
    permissionLevel: bot.PERMISSIONS.MODERATORS,
    category: bot.CATEGORIES.UTILITY,
    cooldown: 0
  })
}