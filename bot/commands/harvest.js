// const chalk = require("chalk")

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
                  money: 1
                }
              }
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
      }
    })

  }, bot.cooldown(15000))
}