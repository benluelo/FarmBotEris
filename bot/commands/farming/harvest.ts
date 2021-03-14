import { FarmBotClient } from "../../lib/FarmBotClient.js"

import cropData from "../../lib/crop-data.js"
import { Embed } from "../../lib/Embed.js"
import {parsePlotNumber} from "../../lib/parse-plot-number.js"
import Log from "../../src/logger.js"
import CONSTANTS from "../../lib/CONSTANTS.js"
import { CropName } from "../../dtos/Crop.js"

export function run(bot: FarmBotClient) {
  bot.addCommand("harvest", async (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error("command `farm sell` requires a user data.")
    }
    if (bot.database === undefined) {
      return message.send("Database not yet initialized. Please try again in a moment.")
    }

    const plotToHarvest = args[0]

    const farm = userdata.farm
    let totalPlots = 0
    const harvested: Record<string, number> = Object.fromEntries(Object.keys(cropData).map((key) => { return [key, 0] }))

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
            if (bot.ENV.DEBUG === "true") { console.log(error.message)} 
          })
        }
      }

      if (totalPlots > 0) {
        return message.send(new Embed().success(`Harvested **${totalPlots}** plot${totalPlots == 1 ? "" : "s"} and got:\n${
          // eslint-disable-next-line no-unused-vars
          Object.entries(harvested).filter(([_crop, amount]) => {
            return amount != 0
          }).map(([crop, amount]) => {
            return `${cropData[crop as CropName].emoji} x **${amount}**`
          }).join("\n")}`))
      } else {
        message.send(new Embed().uhoh("There's nothing in your field that can be harvested!"))
      }

    } else {
      // harvest just one plot
      const plotNumber = parsePlotNumber(plotToHarvest)
      if (plotNumber !== undefined) {

        if (plotNumber >= userdata.farm.length) {
          return message.send(new Embed().uhoh("You don't own that plot!"))
        } else {
          const userCrop = userdata.farm[plotNumber].crop

          if (userCrop.planted === "dirt") { return message.send(new Embed().uhoh(`There's nothing on plot #\`${plotToHarvest.toUpperCase()}\` to harvest!`))} 

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
              if (error) { Log.error(error)} 
            })
            message.send(new Embed().success(`Harvested the **${cropData[userCrop.planted].emoji}** on \`${(plotToHarvest).toUpperCase()}\`!`))
          } else {
            message.send(new Embed().uhoh(`The ${cropData[userdata.farm[plotNumber].crop.planted as CropName].emoji} on  plot #\`${plotToHarvest.toUpperCase()}\` hasn't finished growing yet!`))
          }
        }
      }
    }
  }, {
    description: "Harvest your crops.",
    usage: "farm harvest [plot]​",
    examples: "​farm harvest a1\n└> harvest a specific plot.\nfarm harvest\n└> harvest all of your crops.",
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 5000
  })
}