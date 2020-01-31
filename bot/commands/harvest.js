// const chalk = require("chalk")
const { parsePlotNumber } = require("../lib/parsePlotNumber.js")
// eslint-disable-next-line no-unused-vars
module.exports.run = async (bot) => {
  // eslint-disable-next-line no-unused-vars
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

            // console.log(chalk.bold.keyword("brown")(`FARM PLOT #${plot}:\n`), farm[plot])

            if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])){

              // console.log("TEST BEFORE:", plot, userCrop.planted)

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
                // eslint-disable-next-line no-unused-vars
              ).then((res) => {
                totalPlots += 1
                value += parseFloat(bot.getPriceOfSeeds[userCrop.planted])

                // console.log("TEST AFTER:", plot, res.value.userCrop.planted)
                // console.log(chalk.bold.blue(`PLOT #${plot} HARVESTED`))

              }).catch(err => {
                console.log(err.message)
              })

              // console.log("test:", plot)

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

        // console.log(chalk.yellow.underline(`${totalPlots} plots harvested in total`))
      }
    })

  }, bot.cooldown(15000))
}