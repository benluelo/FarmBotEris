const ms = require("parse-ms")
const { Embed, ProgressBar } = require("../lib/classes")
const { parsePlotNumber } = require("../lib/parse-plot-number.js")
const { parse } = require("twemoji")

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

exports.run = (bot) => {
  bot.registerCommand("info", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) throw err

      // check for plant/plot info
      if (args[0]) {
        let plotNumber = parsePlotNumber(args[0])
        if (plotNumber !== false) {

          if (!userdata) {
            bot.startMessage(message)
            return
          }
          if (userdata) {
            console.log(plotNumber)
            if (plotNumber >= userdata.farm.length) {
              bot.createMessage(message.channel.id, "You don't own that plot!")
              return
            } else {
              const userCrop = userdata.farm[plotNumber].crop
              console.log(JSON.stringify(userCrop))

              // console.log(JSON.stringify(userdata, null, 4))

              console.log((
                Date.now() -
                userCrop.datePlantedAt
              ) /
              bot.config.farminfo.growTimes[userCrop.planted])

              let growthPercentage = clamp(
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

              console.log("Time difference:", (Date.now() - userCrop.datePlantedAt))
              console.log("growthPercentage:", growthPercentage)

              // calculate the time until growth
              let timeUntilPlantFinished
              if (bot.config.farminfo.growTimes[userCrop.planted] - (Date.now() - userCrop.datePlantedAt) > 0) {
                let temptime = ms((userCrop.datePlantedAt + bot.config.farminfo.growTimes[userCrop.planted]) - Date.now())
                timeUntilPlantFinished = `${temptime.hours}h ${temptime.minutes}m ${temptime.seconds}s\n`
              } else {
                timeUntilPlantFinished = "Fully grown!\n"
              }

              const p = new ProgressBar(1, growthPercentage, 10)

              let growthBar = timeUntilPlantFinished + p.show() + ` ${growthPercentage.toFixed(2) * 100}%`
              const emojiURL = parse(bot.cropEmoji[userCrop.planted]).match(/https.*png/)[0]
              console.log(emojiURL)
              const infoEmbed = new Embed()
                // .setAuthor(bot.user.username, bot.user.avatarURL)
                .setColor(bot.color.lightgreen)
                .setDescription(`Info for plot #\`${args[0].toUpperCase()}\``)
                .addField("Currently planted:", bot.cropEmoji[userCrop.planted])
                .setThumbnail(emojiURL)

              if (userCrop.planted != "dirt") {
                infoEmbed.addField("Time until grown:", growthBar)
              }

              bot.createMessage(message.channel.id, infoEmbed.show())
            }
          }

        }
      } else {
        bot.createMessage(message.channel.id, "Please specify the plot you want info on!")
      }
    })
  }, bot.cooldown(15000))
}