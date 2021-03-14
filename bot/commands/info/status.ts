import ms from "parse-ms"
import sysinfo from "systeminformation"
import CONSTANTS from "../../lib/CONSTANTS.js"
import { Embed } from "../../lib/Embed.js"
import { FarmBotClient } from "../../lib/FarmBotClient.js"

/**
 * @description Formats bytes.
 * @param bytes - number of bytes.
 * @param decimals - Decimal precision. Defaults to `2`.
 * @returns The formatted bytes.
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes) { return "0 Bytes" }
  const k = 1024
  const dm = 0 > decimals ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

// get system info
const systemInfo = {
  mem: "",
  cpu: "",
  os: "",
}
setInterval(async () => {
  const os = await sysinfo.osInfo()
  systemInfo.mem = `${formatBytes(await sysinfo.mem().then((data) => data.used))} : ${formatBytes(await sysinfo.mem().then((data) => data.total))}`
  systemInfo.cpu = `${Math.round(await sysinfo.currentLoad().then((data) => data.currentload))}%`
  systemInfo.os = `${os.platform} ${os.distro} ${os.codename}#${os.release} ${os.arch}`
}, 10000)

export function run(bot: FarmBotClient) {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("status", async (message, _args, _userdata) => {

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
      .addField("SYS OS", `\`${systemInfo.os}\``, true)
      .addField("SYS Mem", `\`${systemInfo.mem}\``, true)

      .addField("Debug Mode", debugMode, true)
      .addField("Development Mode", developmentMode, true)
      .addBlankField(true)

    return message.send(statusEmbed)
  }, {
    description: "The status of the bot. (more detailed version of `farm botinfo`)",
    usage: "​farm status",
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.MODERATORS,
    category: CONSTANTS.CATEGORIES.UTILITY,
    cooldown: 0
  })
}