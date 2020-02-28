const cropData = require("../../lib/crop-data.js")
const getPriceOfSeeds = require("../../lib/get-price-of-seeds")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("seeds", (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      let seeds = ""
      for (const crop in userdata.seeds.common) {
        if (userdata.seeds.common[crop].discovered) {
          seeds += `${cropData[crop].emoji} ${crop.charAt(0).toUpperCase() + crop.slice(1)} - \`$${getPriceOfSeeds[crop]}\` \n`
        }
      }
      const seedsEmbed = new bot.Embed()
        .setTitle("Seeds")
        .setDescription("Prices update every hour\n" + seeds)
        .setColor(bot.color.lightgreen)
        .setTimestamp()
      await message.send(seedsEmbed)
    })
  }, bot.cooldown(3000))
}