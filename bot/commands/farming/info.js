const ms = require("parse-ms")
const { ProgressBar, Attachment } = require("../../lib/classes")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")
// const cropData = require("../../lib/crop-data.js")
// const emoji = require("../../lib/emoji.json")

/**
 * @description Clamps a number between two provided values.
 * @param {Number} num - The number to clamp.
 * @param {Number} min - The minimum value for the number.
 * @param {Number} max - The maximum value for the number.
 * @returns {Number} The clamped number.
 */
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.registerCommand("info", async (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      // check for plant/plot info
      if (args[0]) {
        const plotNumber = parsePlotNumber(args[0]) // plotNumber returns false and NaN depending on the input // doesn't act how you think it will
        if (plotNumber !== false) { // this is broken asf

          if (userdata) {
            if (process.env.DEBUG === "true") { console.log(plotNumber) }

            if (plotNumber >= userdata.farm.length) {
              message.send(new bot.embed().uhoh("You don't own that plot!"))
              return
            } else {
              const userCrop = userdata.farm[plotNumber].crop
              if (process.env.DEBUG === "true") {
                console.log(JSON.stringify(userCrop))

                // console.log(JSON.stringify(userdata, null, 4))

                console.log((
                  Date.now() -
                  userCrop.datePlantedAt
                ) /
                bot.config.farminfo.growTimes[userCrop.planted])
              }

              const growthPercentage = clamp(
                (
                  (
                    Date.now() -
                    userCrop.datePlantedAt
                  ) /
                  bot.config.farminfo.growTimes[userCrop.planted]
                ),
                0,
                1
              )

              if (process.env.DEBUG === "true") {
                console.log("Time difference:", (Date.now() - userCrop.datePlantedAt))
                console.log("growthPercentage:", growthPercentage)
              }

              // calculate the time until growth
              let timeUntilPlantFinished
              if (0 < bot.config.farminfo.growTimes[userCrop.planted] - (Date.now() - userCrop.datePlantedAt)) {
                const timeSincePlanted = ms((userCrop.datePlantedAt + bot.config.farminfo.growTimes[userCrop.planted]) - Date.now())
                timeUntilPlantFinished = `${timeSincePlanted.hours}h ${timeSincePlanted.minutes}m ${timeSincePlanted.seconds}s\n`
              } else {
                timeUntilPlantFinished = "Fully grown!\n"
              }

              const p = new ProgressBar(growthPercentage, 1, 10)
              const growthBar = timeUntilPlantFinished + p.show() + ` ${Math.floor(growthPercentage * 100)}%`
              const attachment = new Attachment(userCrop.planted)

              const infoEmbed = new bot.embed()
                .setColor(bot.color.lightgreen)
                .setTitle(`Info for plot #\`${args[0].toUpperCase()}\``)
                .setThumbnail(attachment.link())

              if ("dirt" != userCrop.planted) {
                infoEmbed.addField("**Time until grown:**", growthBar)
              }
              // console.log(f)

              message.send(infoEmbed, attachment.send())
            }
          } else {
            bot.startMessage(message)
          }
        } else {
          message.send(new bot.embed().uhoh("Please enter a valid plot format! `<letter><number>`"))
        }
      } else {
        message.send(new bot.embed().uhoh("Please specify the plot you want info on!"))
      }
    })
  }, bot.cooldown(3000))
}