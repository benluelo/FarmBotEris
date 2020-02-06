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

<<<<<<< HEAD
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
                  money: 1
=======
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
                    [`seeds.common.${userCrop.planted}.amount`]: 1
                  }
>>>>>>> e5509497b814d66b6d8a71df5f2c898ea4bdf5db
                }
              ).then(() => {
                totalPlots += 1

              }).catch(err => {
                console.log(err.message)
              })
            }
          }

          bot.createMessage(message.channel.id,
            `**${totalPlots}** plots harvested in total!`)

        } else {
          //harvest just one plot

          let plotNumber = parsePlotNumber(args[0])
          if (plotNumber !== false) {

            if (plotNumber >= userdata.farm.length) {
              return bot.createMessage(message.channel.id, "You don't own that plot!")
            } else {
              const userCrop = userdata.farm[plotNumber].crop

              if ((userCrop.planted != "dirt") && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                  {
                    $set: {
                      [`farm.${plotNumber}.crop.planted`]: "dirt",
                      [`farm.${plotNumber}.crop.datePlantedAt`]: Date.now(),
                    },
                    $inc: {
                      [`seeds.common.${userCrop.planted}.amount`]: 1
                    }
                  }
                ).catch(err => {
                  console.log(err.message)
                })
                bot.createMessage(message.channel.id,
                  `You harvested the **${userCrop.planted}** on #${args[0]}!`)
              } else {
                bot.createMessage(message.channel.id, "Cannot harvest dirt!")
              }
<<<<<<< HEAD
              // eslint-disable-next-line no-unused-vars
            ).then((res) => {
              totalPlots += 1
              value += 1

              // console.log("TEST AFTER:", plot, res.value.userCrop.planted)
              // console.log(chalk.bold.blue(`PLOT #${plot} HARVESTED`))

            }).catch(err => {
              console.log(err.message)
            })

            // console.log("test:", plot)

          }

        }

        // console.log(chalk.yellow.underline(`${totalPlots} plots harvested in total`))

        bot.createMessage(
          message.channel.id,
          `${totalPlots} plots harvested in total, you made ${value} <:farmbot_coin:648032810682023956> selling the crops!`)
=======
            }
          }

        }
>>>>>>> e5509497b814d66b6d8a71df5f2c898ea4bdf5db
      }
    })

  }, bot.cooldown(15000))
}