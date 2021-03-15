import CONSTANTS from "../../data/CONSTANTS.js"
import { Embed } from "../../lib/Embed.js"
import { FarmBotClient } from "../../lib/FarmBotClient.js"
import emoji from "../../json/emoji.json"
import { formatMoney } from "../../utils/formatMoney.js"

export function run(bot: FarmBotClient) {
  bot.addCommand("money", (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error("command `farm money` requires a user data.")
    }
    if (bot.database === undefined) {
      return message.send("Database not yet initialized. Please try again in a moment.")
    }

    message.send(new Embed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(bot.color.lightgreen)
      .setDescription(`Balance: **${formatMoney(userdata.money)}**`))
  }, {
    description: `View your current ${emoji.coin} balance.`,
    usage: "​farm money",
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    aliases: ["cash"],
    cooldown: 2000
  })
}