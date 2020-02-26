const { parsePlotNumber } = require("../../lib/parse-plot-number")
const cropData = require("../../lib/crop-data.js")

/** @param {import("../../index.js").Bot} bot */
module.exports.run = async (bot) => {
  bot.registerCommand("harvest", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const farm = userdata.farm
        let totalPlots = 0

        // harvest all plots
        if (!args[0]) {
          for (const plot in farm) {

            const userCrop = farm[plot].crop

            if (("dirt" != userCrop.planted) && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                {
                  $set: {
                    [`farm.${plot}.crop.planted`]: "dirt",
                    [`farm.${plot}.crop.datePlantedAt`]: Date.now(),
                  },
                  $inc: {
                    [`seeds.common.${userCrop.planted}.amount`]: 1,
                    [`seeds.common.${userCrop.planted}.level`]: 1
                  }
                }
              ).then(() => {
                totalPlots += 1

              }).catch((error) => {
                if (process.env.DEBUG === "true") { console.log(error.message) }
              })
            }
          }

          if (totalPlots !== 0) {
            return message.send(new bot.embed().success(`**${totalPlots}** plots harvested!`))
          } else {
            message.send(new bot.embed().error("Nothing to harvest"))
          }

        } else {
          // harvest just one plot

          const plotNumber = parsePlotNumber(args[0])
          if (false !== plotNumber) {

            if (plotNumber >= userdata.farm.length) {
              return message.send(new bot.embed().error("You don't own that plot!"))
            } else {
              const userCrop = userdata.farm[plotNumber].crop

              if (("dirt" != userCrop.planted) && ((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                  {
                    $set: {
                      [`farm.${plotNumber}.crop.planted`]: "dirt",
                      [`farm.${plotNumber}.crop.datePlantedAt`]: Date.now(),
                    },
                    $inc: {
                      [`seeds.common.${userCrop.planted}.amount`]: 1,
                      [`seeds.common.${userCrop.planted}.level`]: 1
                    }
                  }
                ).catch((error) => {
                  if (err) { bot.log.error(error) }
                })
                message.send(new bot.embed().success(`Harvested the **${cropData[userCrop.planted].emoji}** on \`${(args[0]).toUpperCase()}\`!`))
              } else {
                message.send(new bot.embed().error("Cannot harvest dirt!"))
              }
            }
          }
        }
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(15000))
}