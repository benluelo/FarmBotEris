// const chalk = require("chalk")

// eslint-disable-next-line no-unused-vars
module.exports.run = async (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("harvest", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (!userdata) {
        bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
      }
      if (userdata) {
        let farm = userdata.farm
        let totalPlots = 0
        for(let plot in farm){
      
          // console.log(chalk.bold.keyword("brown")(`FARM PLOT #${plot}:\n`), farm[plot])
      
          if((farm[plot].crop.planted != bot.config.farminfo.dirt) && ((Date.now() - farm[plot].crop.datePlantedAt) >= bot.config.farminfo.growTimes[farm[plot].crop.planted])){
      
            // console.log("TEST BEFORE:", plot, farm[plot].crop.planted)
      
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, 
              {
                $set: {
                  [`farm.${plot}.crop.planted`]: bot.dirt,
                  [`farm.${plot}.crop.datePlantedAt`]: Date.now(),
                },
                $inc: {
                  money: 1
                }
              }
              // eslint-disable-next-line no-unused-vars
            ).then((res) => {
              totalPlots += 1
      
              // console.log("TEST AFTER:", plot, res.value.farm[plot].crop.planted)
              // console.log(chalk.bold.blue(`PLOT #${plot} HARVESTED`))
      
            }).catch(err => {
              console.log(err.message)
            })
      
            // console.log("test:", plot)
      
          }
      
        }
                  
        // console.log(chalk.yellow.underline(`${totalPlots} plots harvested in total`))
      
        bot.createMessage(message.channel.id, `${totalPlots} plots harvested in total`)
      }
    })

  })
}