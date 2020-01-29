// const all = require("./plant/all.js")
const parsePlotNumber = require("../lib/parsePlotNumber.js")

exports.run = (bot) => {
  bot.registerCommand("plant", (message, args) => {

    // // check if planting all
    // if(args[0] === "all"){
    //   all.run(bot, message, args)
    //   return
    // }
    
    // check specified plot
    if(args[0]){
    
      // check if input is valid
      let plotNumber = parsePlotNumber.pNum(args[0])
      if(plotNumber !== false){
        
        bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
    
          if(err) throw err
    
          if (!userdata) {
            bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
          }
          if (userdata) {
            if(plotNumber >= userdata.farm.length){
              bot.createMessage(message.channel.id, "You don't own that plot!")
              return
            }
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, 
              {
                $set: {
                  [`farm.${plotNumber}.crop.planted`] : "apple",
                  [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
                }
              }
            )
          }
        })
      }else{
        bot.createMessage(message.channel.id, "Invalid input! Please try again with the format `<letter><number>`.")
      }
    }else{
      bot.createMessage(message.channel.id, "You have to specify a plot to plant on!")
    }

  // eslint-disable-next-line no-unused-vars
  }).registerSubcommand("all", (message, args) => {

    bot.createMessage(message.channel.id, "Planting all!").then(msg => {

      let totalPlots = 0

      bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
        if (!userdata) {
          bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
        }
        if (userdata) {
          for(let plot in userdata.farm){
            if(userdata.farm[plot].crop.planted === bot.config.farminfo.dirt){
              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, 
                {
                  $set: {
                    [`farm.${plot}.crop.planted`] : "apple",
                    [`farm.${plot}.crop.datePlantedAt`] : Date.now()
                  }
                }
              // eslint-disable-next-line no-unused-vars
              ).then(res => {
                totalPlots += 1
                // msg.edit(`Succesfully planted plot #${plot}`)
              })
            }
          }
        }
        msg.edit(`Succesfully planted ${totalPlots} plots!`)
      })
    })

  })
}