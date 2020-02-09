const { parsePlotNumber } = require("../lib/parsePlotNumber.js")

module.exports.run = async (bot) => {
  bot.registerCommand("harvest", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (!userdata) {
        bot.startMessage(message)
        return
      }
      if (userdata) {
        let farm = userdata.farm
        let totalPlots = 0
        // let totalValue = 0

        // harvest all plots
        if (!args[0]) {
          for (let plot in farm) {

            const userCrop = farm[plot].crop

            if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])){
              // const cropValue = bot.getPriceOfSeeds[userCrop.planted] * (1 + bot.getLevel(userdata.seeds.common[userCrop.planted].amount))
              // totalValue += cropValue
              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                {
                  $set: {
                    [`farm.${plot}.crop.planted`]: "dirt",
                    [`farm.${plot}.crop.datePlantedAt`]: Date.now(),
                  },
                  $inc: {
                    [`seeds.common.${userCrop.planted}.amount`]: 1,
                    [`seeds.common.${userCrop.planted}.level`]: 1,
                    // money: cropValue
                  }
                }
              ).then(() => {
                totalPlots += 1

              }).catch(err => {
                console.log(err.message)
              })
            }
          }

          bot.createMessage(message.channel.id,
            `**${totalPlots}** plots harvested!`) // for a total of **${bot.formatMoney(totalValue)}** <:farmbot_coin:648032810682023956>!`)

        } else {
          //harvest just one plot

          let plotNumber = parsePlotNumber(args[0])
          if (plotNumber !== false) {

            if (plotNumber >= userdata.farm.length) {
              return bot.createMessage(message.channel.id, "You don't own that plot!")
            } else {
              const userCrop = userdata.farm[plotNumber].crop

              if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
                // const cropValue = bot.getPriceOfSeeds[userCrop.planted] * (1 + bot.getLevel(userdata.seeds.common[userCrop.planted].amount))
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                  {
                    $set: {
                      [`farm.${plotNumber}.crop.planted`]: "dirt",
                      [`farm.${plotNumber}.crop.datePlantedAt`]: Date.now(),
                    },
                    $inc: {
                      [`seeds.common.${userCrop.planted}.amount`]: 1,
                      [`seeds.common.${userCrop.planted}.level`]: 1,
                      // money: cropValue
                    }
                  }
                ).catch(err => {
                  console.log(err.message)
                })
                bot.createMessage(message.channel.id,
                  `Harvested the **${userCrop.planted}** on \`${args[0]}\`!`)// , and made **${bot.formatMoney(cropValue)}** <:farmbot_coin:648032810682023956>!`)
              } else {
                bot.createMessage(message.channel.id, "Cannot harvest dirt!")
              }
            }
          }
        }
      }
    })
  }, bot.cooldown(15000))
}