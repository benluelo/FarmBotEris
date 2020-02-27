const { parsePlotNumber } = require("../../lib/parse-plot-number")
const cropData = require("../../lib/crop-data.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = async (bot) => {
  bot.registerCommand("harvest", (message, args) => {

    const plotToHarvest = args[0]

    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const farm = userdata.farm
        let totalPlots = 0
        const harvested = Object.fromEntries(Object.keys(cropData).map((key) => { return [key, 0] }))
        console.log(harvested)

        // harvest all plots
        if (!plotToHarvest) {
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
                harvested[userCrop.planted]++
                totalPlots += 1

              }).catch((error) => {
                if (process.env.DEBUG === "true") { console.log(error.message) }
              })
            }
          }

          if (totalPlots !== 0) {
            return message.send(new bot.embed().success(`Harvested **${totalPlots}** plots and got: \n${
              Object.entries(harvested).filter((key) => {
                return key[1] != 0
              }).map((key) => {
                return `${cropData[key[0]].emoji} x **${key[1]}**`
              }).join("\n")
            }`))
          } else {
            message.send(new bot.embed().uhoh("There's nothing in your field that can be harvested!"))
          }

        } else {
          // harvest just one plot

          const plotNumber = parsePlotNumber(plotToHarvest)
          if (false !== plotNumber) {

            if (plotNumber >= userdata.farm.length) {
              return message.send(new bot.embed().uhoh("You don't own that plot!"))
            } else {
              const userCrop = userdata.farm[plotNumber].crop

              if (userCrop.planted == "dirt") { return message.send(new bot.embed().uhoh(`There's nothing on plot #\`${plotToHarvest.toUpperCase()}\` to harvest!`)) }

              if (((Date.now() - userCrop.datePlantedAt) >= bot.config.farminfo.growTimes[userCrop.planted])) {
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
                message.send(new bot.embed().success(`Harvested the **${cropData[userCrop.planted].emoji}** on \`${(plotToHarvest).toUpperCase()}\`!`))
              } else {
                message.send(new bot.embed().uhoh(`The ${cropData[userdata.farm[plotNumber].crop.planted].emoji} on  plot #\`${plotToHarvest.toUpperCase()}\` hasn't finished growing yet!`))
              }
            }
          }
        }
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(5000))
}