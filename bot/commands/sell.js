exports.run = (bot) => {
  bot.registerCommand("sell", (message, args) => {
    // f!sell <plant> [amount]

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) throw err

      if (!userdata) { return bot.startMessage(message) }

      if (!args[0]) {
        return bot.createMessage(message.channel.id, "You have to specify a plant to sell!")
      } else if (!args[1]) {
        // sell all of the specified crop
        if (!bot.plants[args[0]]) {return bot.createMessage(message.channel.id, "Not a valid crop!") }
        const seed = args[0]
        if (userdata.seeds.common[seed].amount != 0) {
          const totalSold = userdata.seeds.common[seed].amount
          const cropValue = bot.getPriceOfSeeds[seed] * bot.getLevel(userdata.seeds.common[seed].level) * totalSold
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
          return bot.createMessage(message.channel.id, `Sold **${totalSold}** ${bot.plants[seed]} for **${bot.formatMoney(cropValue)}**!`)
        } else {
          return bot.createMessage(message.channel.id, `You don't have any ${args[0]}s to sell!`)
        }
      } else if (args[0] && args[1]) {

        // sell the specified amount of the specified crop

        const seed = args[0]
        if (!bot.plants[seed]) { return bot.createMessage(message.channel.id, "Not a valid crop!") }

        const amount = parseInt(args[1])
        if (amount.toString() !== args[1]) { return bot.createMessage(message.channel.id, "You have to enter a valid number to sell!") }

        if (userdata.seeds.common[seed].amount >= amount) {
          const cropValue = bot.getPriceOfSeeds[seed] * bot.getLevel(userdata.seeds.common[seed].level) * amount
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
            {
              $inc: {
                [`seeds.common.${seed}.amount`] : - amount,
                money: cropValue
              }
            }
          )
          bot.createMessage(message.channel.id, `Sold **${amount}** ${bot.plants[seed]} for **${bot.formatMoney(cropValue)}**!`)
        } else {
          return bot.createMessage(message.channel.id, "You have to specify a crop to sell!")
        }
      }
    })
  }, bot.cooldown(5000)).registerSubcommand("all", (message) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {
        return bot.startMessage(message)
      }

      bot.createMessage(message.channel.id, "Selling all!").then(async msg => {

        let totalSold = 0
        let totalValue = 0

        if (userdata) {
          for (let seed in userdata.seeds.common) {
            if (userdata.seeds.common[seed].amount != 0) {
              const cropValue = bot.getPriceOfSeeds[seed] * (bot.getLevel(userdata.seeds.common[seed].level))
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
          }
          msg.edit(`Sold **${totalSold}** crops for **${bot.formatMoney(totalValue)}**!`)
        }
      })
    })

  }, bot.cooldown(15000))
}