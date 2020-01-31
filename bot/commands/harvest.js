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
        let value = 0

        // harvest all plots
        if (!args[0]) {
          for (let plot in farm) {

            const userCrop = farm[plot].crop

            if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])){

              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                {
                  $set: {
                    [`farm.${plot}.crop.planted`]: "dirt",
                    [`farm.${plot}.crop.datePlantedAt`]: Date.now(),
                  },
                  $inc: {
                    money: parseFloat(bot.getPriceOfSeeds[userCrop.planted])
                  }
                }
              ).then(() => {
                totalPlots += 1
                value += parseFloat(bot.getPriceOfSeeds[userCrop.planted])

              }).catch(err => {
                console.log(err.message)
              })
            }
          }

          bot.createMessage(message.channel.id,
            `**${totalPlots}** plots harvested in total, you made **${value}** <:farmbot_coin:648032810682023956> selling the crops!`)

        } else {
          //harvest just one plot

          let plotNumber = parsePlotNumber(args[0])
          if (plotNumber !== false) {

            if (plotNumber >= userdata.farm.length) {
              bot.createMessage(message.channel.id, "You don't own that plot!")
              return
            } else {
              const userCrop = userdata.farm[plotNumber].crop
              value = bot.getPriceOfSeeds[userCrop.planted]

              if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                  {
                    $set: {
                      [`farm.${plotNumber}.crop.planted`]: "dirt",
                      [`farm.${plotNumber}.crop.datePlantedAt`]: Date.now(),
                    },
                    $inc: {
                      money: parseFloat(value)
                    }
                  }
                ).catch(err => {
                  console.log(err.message)
                })
                bot.createMessage(message.channel.id,
                  `You made **${value}** <:farmbot_coin:648032810682023956> selling the crop!`)
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