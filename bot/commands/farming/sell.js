const cropData = require("../../lib/crop-data.js")
const getPriceOfSeeds = require("../../lib/get-price-of-seeds")
const { getLevel } = require("../../../helpers/level-test.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("sell", async (message, args, userdata) => {

    /** @description The amount of the crop to sell. */
    const amount = args[0]
    /** @description The crop to sell. */
    const crop = args[1]

    if (!amount) { return message.send(new bot.Embed().uhoh("You have to specify both an `amount` and a `crop`  to sell!")) }
    else if (crop && amount) {

      // sell the specified amount of the specified crop
      // i.e. `farm sell 2 apple`

      if (!cropData[crop]) { return message.send(new bot.Embed().uhoh("Not a valid crop!")) }

      const numAmount = parseInt(amount)
      if (numAmount.toString() !== amount) { return message.send(new bot.Embed().uhoh(`**${amount}** isn't a number!`)) }

      if ((!cropData[crop] || !userdata.seeds.common[crop].discovered)) { return message.send(new bot.Embed().uhoh(`Couldn't find **${crop} in your seedbag... maybe you mispelled it?`)) }
      if (userdata.seeds.common[crop].amount >= numAmount) {

        if (bot.ENV.DEBUG === "true") {
          console.log("Crop:", crop)
          console.log("Seed price:", getPriceOfSeeds[crop])
          console.log("Level:", getLevel(userdata.seeds.common[crop].level).level)
        }
        // yes lmaoo // words are hard, i get it // fucking extremely // i give WORDS // Fucking leave this in for production lmao // (╯°□°）╯︵ ┻━┻ // YESS // i have a spell checker extenstion because  i never trust myself // LOL i saw that when you liveshared with me i was wondering what that was // HAHA
        console.log(getLevel(userdata.seeds.common[crop].level))
        const cropValue = getPriceOfSeeds[crop] * getLevel(userdata.seeds.common[crop].level).level * numAmount
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
          {
            $inc: {
              [`seeds.common.${crop}.amount`] : - numAmount,
              money: cropValue
            }
          }
        )
        message.send(new bot.Embed().success(`Sold **${numAmount}** ${cropData[crop].emoji} for **${bot.formatMoney(cropValue)}**!`))
      } else {
        return message.send(new bot.Embed().uhoh(`You don't have that many ${cropData[crop]}!`))
      }
    } else {
      message.send(new bot.Embed().uhoh("You need to use the format: `farm sell <amount> <crop>`"))
    }
  }, {
    description: "Sell a crop in your inventory.",
    usage:  "​farm sell <amount> <crop>",
    examples: "farm sell 12 apple",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: null,
    cooldown: 3000
  }).subcommand("all", (message, args, userdata) => {

    /**
     * @type {Object<string, number>}
     */
    const sold = Object.fromEntries(Object.keys(cropData).map((key) => { return [key, 0] }))

    message.send("Sellling all of your crops...").then(async (msg) => {

      let totalSold = 0
      let totalValue = 0

      for (const seed in userdata.seeds.common) {
        if (0 != userdata.seeds.common[seed].amount) {

          if (bot.ENV.DEBUG === "true") {
            console.log(seed)
            console.log("Seed price:", getPriceOfSeeds[seed])
            console.log("Level:", getLevel(2, userdata.seeds.common[seed].level).level)
          }

          const cropValue = getPriceOfSeeds[seed] * (getLevel(2, userdata.seeds.common[seed].level).level) * userdata.seeds.common[seed].amount
          totalValue += cropValue
          totalSold += userdata.seeds.common[seed].amount
          sold[seed] += userdata.seeds.common[seed].amount
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
            {
              $set: {
                [`seeds.common.${seed}.amount`] : 0,
              },
              $inc: {
                money: cropValue
              }
            }
          )
        }

        if (totalSold == 0) {
          msg.edit({
            content: "",
            ...new bot.Embed().uhoh("You don't have any crops to sell!")
          })
        } else {
          msg.edit({
            content: "",
            ...new bot.Embed()
              .setTitle("Sold!")
              .setDescription(`${
                Object.entries(sold).filter(([crop, amount]) => {
                  return amount != 0
                }).map(([crop, amount]) => {
                  return `${cropData[crop].emoji} x **${amount}**`
                }).join("\n")}\n for a total of **${bot.formatMoney(totalValue)}!**`)
          })
        }
      }
    })
  }, {
    description: "Sell all of a crop in your inventory.",
    usage:  "​farm sell <amount> <crop>",
    examples: "farm sell all apple",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000
  })
}