import CONSTANTS from "../../../lib/CONSTANTS.js"
import { Embed } from "../../../lib/Embed.js"
import { FarmBotClient } from "../../../lib/FarmBotClient.js"
import { XPProgressBar } from "../../../lib/XPProgressBar.js"

export function run(bot: FarmBotClient) {
  bot.addCommand("village", (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error("command `farm sell` requires a user data.")
    }
    if (bot.database === undefined) {
      return message.send("Database not yet initialized. Please try again in a moment.")
    }

    const villageEmbed = new Embed()
      .setColor(bot.color.lightgreen)
      .setTitle(`${message.author.username}'s Village!   ${userdata.region.flag}`)

    for (const farmer in userdata.farmers) {
      const progressBar = new XPProgressBar(userdata.farmers[farmer].level, 10, userdata.farmers[farmer].wealth + 2)
      villageEmbed.addField(userdata.farmers[farmer].name, userdata.farmers[farmer].emoji + " Level  **" + progressBar.level() + "**\n" + progressBar.show(), true)
    }
    message.send(villageEmbed.addBlankField(true))
  }, {
    description: "Shows you the village of all the people and their levels",
    usage: "​farm village",
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 5000
  })
}