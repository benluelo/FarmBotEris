const ms = require("parse-ms")
const { parsePlotNumber } = require("../lib/parsePlotNumber.js")

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

exports.run = (bot) => {
  bot.registerCommand("info", (message, args) => {
    if (args[0]) {
      let plotNumber = parsePlotNumber(args[0])
      if (plotNumber !== false) {
            
        bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
        
          if (err) throw err
        
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
                timeUntilPlantFinished = "0h 0m 0s\n"
              }

              let growthBar = timeUntilPlantFinished + "█".repeat(growthPercentage*10) + "░".repeat(10 - growthPercentage*10) + ` ${growthPercentage.toFixed(2) * 100}%`
        
              const infoEmbed = {
                embed: {
                  author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                  },
                  color: bot.color.lightgreen,
                  description: `Info for plot #\`${args[0][0].toUpperCase() + args[0][1]}\``,
                  fields: [
                    {
                      name: "Currently planted:",
                      value: bot.plants[userCrop.planted]
                    }
                  ],
                  thumbnail: {
                    url: "https://i.imgur.com/tHDIEKj.png"
                  }
                }
              }

              if (userCrop.planted != "dirt") {
                infoEmbed.embed.fields.push({
                  name: "Time until grown:",
                  value: growthBar
                })
              }
              
              bot.createMessage(message.channel.id, infoEmbed)
            }
          }
        })
      }
    } else {
      bot.createMessage(message.channel.id, "Please add the plot you want info on")
    }
  }, bot.cooldown(15000))
}