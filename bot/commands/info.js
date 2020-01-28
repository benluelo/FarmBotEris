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

              console.log(JSON.stringify(userdata, null, 4))
        
              let growthPercentage = clamp(
                (
                  (
                    Date.now() -
                    userdata.farm[plotNumber].crop.datePlantedAt) /
                    bot.config.farminfo.growTimes[userdata.farm[plotNumber].crop.planted]
                ),
                0,
                1
              )
        
              console.log((Date.now() - userdata.farm[plotNumber].crop.datePlantedAt))
              console.log(growthPercentage)
        
              let growthBar = "█".repeat(growthPercentage*10) + "░".repeat(10 - growthPercentage*10)
        
              const infoEmbed = {
                embed: {
                  author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                  },
                  fields: [
                    {
                      name: userdata.farm[plotNumber].crop.planted == bot.config.farminfo.dirt? "Dirt": userdata.farm[plotNumber].crop.planted.replace(/(<|>|:)/g, ""),
                      value: userdata.farm[plotNumber].crop.planted
                    }
                  ],
                  description: userdata.farm[plotNumber].crop.planted == bot.config.farminfo.dirt? null: `Time until grown:\n${growthBar}`
                }
              }
              
              bot.createMessage(message.channel.id, infoEmbed)
            }
          }
        })
      }
    }
  })
}