import { CropName, Embed, FarmBotClient } from "../../../global.js"
import cropData from "../../lib/crop-data.js"
const getPriceOfSeeds = require("../../lib/get-price-of-seeds")
const { getLevel } = require("../../../helpers/level-test.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot: FarmBotClient) => {
  bot.addCommand("seeds", (message, _args, userdata) => {
    // console.log(userdata)
    console.log(cropData)
    let seeds = ""
    for (const crop in userdata.seeds.common) {
      if (userdata.seeds.common[crop as CropName].discovered) {
        // i hate this long line lol
        seeds += `${cropData[crop as CropName].emoji} ${crop.charAt(0).toUpperCase() + crop.slice(1)}: **${bot.formatMoney(getPriceOfSeeds[crop] * getLevel(userdata.seeds.common[crop as CropName].level).level)}**\n`
      }
    }
    return message.send(new Embed()
      .setTitle(`**${message.author.username}'s** seedbag!`)
      .setDescription("Prices update every hour!\n" + seeds)
      .setColor(bot.color.lightgreen)
      .setTimestamp())
  }, {
    description: "To get all the seeds and their prices that they sell for per seed",
    usage: "​farm seeds",
    // examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["seedbag"],
    cooldown: 3000
  })
}