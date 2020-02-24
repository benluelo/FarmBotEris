const cropData = require("../../lib/crop-data.js")
const getPriceOfSeeds = require("../../lib/get-price-of-seeds")
const { getLevel } = require("../../../helpers/level-test.js")

/** @param {import("../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("sell", (message, args) => {
    // f!sell <plant> [amount]

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        if (!args[0]) {
          return bot.createMessage(message.channel.id, new bot.embed().error("You have to specify a plant to sell!"))
        } else if (!args[1]) {
          const seed = args[0]
          // sell all of the specified crop
          if (!cropData[seed]) { return bot.createMessage(message.channel.id, new bot.embed().error("Not a valid crop!")) }
          if (0 != userdata.seeds.common[seed].amount) {
            const totalSold = userdata.seeds.common[seed].amount
            let cropValue = getPriceOfSeeds[seed] * totalSold

            // to make sure theres a level otherwise the level is 0 and the price times 0, would just be 0
            if (getLevel(userdata.seeds.common[seed].level).level !== 0) {
              cropValue *= getLevel(userdata.seeds.common[seed].level).level
            }

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
            return bot.createMessage(message.channel.id, new bot.embed().success(`Sold **${totalSold}** ${cropData[seed].emoji} for **${bot.formatMoney(cropValue)}**!`))
          } else {
            return bot.createMessage(message.channel.id, new bot.embed().error(`You don't have any ${args[0]}s to sell!`))
          }
        } else if (args[0] && args[1]) {

          // sell the specified amount of the specified crop

          const seed = args[0]
          if (!cropData[seed]) { return bot.createMessage(message.channel.id, new bot.embed().error("Not a valid crop!")) }

          const amount = parseInt(args[1])
          if (amount.toString() !== args[1]) { return bot.createMessage(message.channel.id, new bot.embed().error("You have to enter a valid number to sell!")) }

          if (userdata.seeds.common[seed].amount >= amount) {

            if (process.env.DEBUG === "true") {
              console.log(seed)
              console.log("Seed price:", getPriceOfSeeds[seed])
              console.log("Level:", bot.getLevel(userdata.seeds.common[seed].level))
            }

            const cropValue = getPriceOfSeeds[seed] * bot.getLevel(userdata.seeds.common[seed].level) * amount
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
              {
                $inc: {
                  [`seeds.common.${seed}.amount`] : - amount,
                  money: cropValue
                }
              }
            )
            bot.createMessage(message.channel.id, new bot.embed().success(`Sold **${amount}** ${cropData[seed].emoji} for **${bot.formatMoney(cropValue)}**!`))
          } else {
            return bot.createMessage(message.channel.id, new bot.embed().error("You have to specify a crop to sell!"))
          }
        }
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(5000)).registerSubcommand("all", (message) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        bot.createMessage(message.channel.id, "Selling all!").then(async (msg) => {

          let totalSold = 0
          let totalValue = 0

          for (const seed in userdata.seeds.common) {
            if (0 != userdata.seeds.common[seed].amount) {

              if (process.env.DEBUG === "true") {
                console.log(seed)
                console.log("Seed price:", getPriceOfSeeds[seed])
                console.log("Level:", getLevel(2, userdata.seeds.common[seed].level).level)
              }

              const cropValue = getPriceOfSeeds[seed] * (getLevel(2, userdata.seeds.common[seed].level).level) * userdata.seeds.common[seed].amount
              totalValue += cropValue
              totalSold += userdata.seeds.common[seed].amount
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
            msg.edit(new bot.embed().success(`Sold **${totalSold}** crops for **${bot.formatMoney(totalValue)}**!`))
          }
        })
      } else {
        bot.startMessage(message)
      }
    })

  }, bot.cooldown(15000))
}