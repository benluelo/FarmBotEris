"use strict"
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, "__esModule", { value: true })
const crop_data_js_1 = __importDefault(require("../../lib/crop-data.js"))
const getPriceOfSeeds = require("../../lib/get-price-of-seeds")
const { getLevel } = require("../../../helpers/level-test.js")
/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("seeds", (message, args, userdata) => {
    // console.log(userdata)
    console.log(crop_data_js_1.default)
    let seeds = ""
    for (const crop in userdata.seeds.common) {
      console.log(crop)
      if (userdata.seeds.common[crop].discovered) {
        seeds += `${crop_data_js_1.default[crop].emoji} ${crop.charAt(0).toUpperCase() + crop.slice(1)}: **${bot.formatMoney(getPriceOfSeeds[crop] * getLevel(userdata.seeds.common[crop].level).level)}**\n`
      }
    }
    return message.send(new bot.Embed()
      .setTitle(`**${message.author.username}'s** seedbag!`)
      .setDescription("Prices update every hour!\n" + seeds)
      .setColor(bot.color.lightgreen)
      .setTimestamp())
  }, {
    description: "To get all the seeds and their prices that they sell for per seed",
    usage: "​farm seeds",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["seedbag"],
    cooldown: 3000
  })
}
