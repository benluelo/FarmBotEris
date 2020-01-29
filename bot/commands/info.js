const parsePlotNumber = require("../lib/parsePlotNumber.js")

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

exports.run = (bot) => {
  bot.registerCommand("info", (message, args) => {
    if(args[0]){
      let plotNumber = parsePlotNumber.pNum(args[0])
      if(plotNumber !== false){
            
        bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
        
          if(err) throw err
        
          if (!userdata) {
            bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
            return
          }
          if (userdata) {
            console.log(plotNumber)
            if(plotNumber >= userdata.farm.length){
              bot.createMessage(message.channel.id, "You don't own that plot!")
              return
            }else{
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
        
              let growthBar = "█".repeat(growthPercentage*10) + "░".repeat(10 - growthPercentage*10)
        
              const infoEmbed = {
                embed: {
                  author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                  },
                  description: "Info for plot #`<L><N>`",
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

              if(userCrop.planted != "dirt"){
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
    }
  })
}