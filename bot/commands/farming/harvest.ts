import { parsePlotNumber } from "../../lib/parse-plot-number";
import cropData from "../../lib/crop-data.js";

/** @param bot */
export const run = async (bot: FarmBotClient) => {
  bot.addCommand("harvest", async (message, args, userdata) => {

    const plotToHarvest = args[0]

    const farm = userdata.farm
    let totalPlots = 0

    const harvested: {
      [crop in Crops.CropName]: number;
    } = Object.fromEntries(Object.keys(cropData).map((key) => { return [key, 0] }))

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

          }).catch((error: Error) => {
            if (bot.ENV.DEBUG === "true") { console.log(error.message) }
          })
        }
      }

      // const a = typeof bot.Embed
      if (totalPlots > 0) {
        return message.send(new bot.Embed().success(`Harvested **${totalPlots}** plot${totalPlots == 1 ? "" : "s"} and got:\n${
          // eslint-disable-next-line no-unused-vars
          Object.entries(harvested).filter(([_crop, amount]) => {
            return amount != 0
          }).map(([crop, amount]) => {
            return `${cropData[crop].emoji} x **${amount}**`
          }).join("\n")
        }`))
      } else {
        message.send(new bot.Embed().uhoh("There's nothing in your field that can be harvested!"))
      }

    } else {
      // harvest just one plot
      const plotNumber = parsePlotNumber(plotToHarvest)
      if (false !== plotNumber) {

        if (plotNumber >= userdata.farm.length) {
          return message.send(new bot.Embed().uhoh("You don't own that plot!"))
        } else {
          const userCrop = userdata.farm[plotNumber].crop

          if (userCrop.planted == "dirt") { return message.send(new bot.Embed().uhoh(`There's nothing on plot #\`${plotToHarvest.toUpperCase()}\` to harvest!`)) }

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
            ).catch((error: Error) => {
              if (error) { bot.log.error(error) }
            })
            message.send(new bot.Embed().success(`Harvested the **${cropData[userCrop.planted].emoji}** on \`${(plotToHarvest).toUpperCase()}\`!`))
          } else {
            message.send(new bot.Embed().uhoh(`The ${cropData[userdata.farm[plotNumber].crop.planted].emoji} on  plot #\`${plotToHarvest.toUpperCase()}\` hasn't finished growing yet!`))
          }
        }
      }
    }
  }, {
    description: "Harvest your crops.",
    usage: "farm harvest [plot]​",
    examples: "​farm harvest a1\n└> harvest a specific plot.\nfarm harvest\n└> harvest all of your crops.",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  })
}