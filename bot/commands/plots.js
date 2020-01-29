const chalk = require("chalk")

const DEBUG = true

exports.run = async (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("plots", (message, args) => {

    // attempt to find the user in the system
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) bot.log.error(err)

      // if the user is NOT in the database, tell them to start
      if (!userdata) {
        bot.createMessage(
          message.channel.id,
          "You have to start farming first! Send `farm start` to start farming!"
        )
        return
      }

      // if the user IS in the database, do stuff
      if (userdata) {

        // grab farm variable
        const FARM = userdata.farm

        // initialize message variables
        var plotsMsg = "" // top of message (numbers)
        var plotsMsgTop = "<:blank:645355907206742023>" // rest of message (letters and plots)

        // send message to let the user know the farm is being built, then build the farm
        bot.createMessage(
          message.channel.id,
          "Building farm..."
        ).then(msg => {
          for(const plot in FARM){
            if(DEBUG) { console.log(chalk.keyword("brown")("CHECKING PLOT #"), plot) }

            // this builds the farm, i really dont want to explain it lol but here goes
            //   1 2 3 4 5
            // A * * * * *
            // B * * * * *
            // C * * * * *
            // D * * * * *
            // E * * * * *
            // adds the letters and numbers as they are needed
            if(plot < 5){
              plotsMsgTop += bot.config.farminfo.msgNums[plot]
            }
            if(plot % 5 === 0){
              plotsMsg += "\n" + bot.config.farminfo.msgLtrs[Math.floor(plot/5)]
            }

            if(DEBUG) { console.log(FARM[plot].crop.planted) }

            // adds the plots to the message
            if(FARM[plot].crop.planted == "dirt"){ // if dirt, add dirt (lol)
              plotsMsg += bot.plants.dirt
            }else if(parseInt(Date.now() - FARM[plot].crop.datePlantedAt) >= parseInt(bot.config.farminfo.growTimes[FARM[plot].crop.planted])){ // if not dirt, and if the crop is grown, add the crop
              plotsMsg += bot.plants[FARM[plot].crop.planted]
            }else{ // if the crop in the plot isn't grown, add a seedling
              plotsMsg += bot.plants.seedling
            }

            if(DEBUG) { console.log("Now:", Date.now()) }
            if(DEBUG) { console.log("Planted at:", FARM[plot].crop.datePlantedAt) }
            if(DEBUG) { console.log("Time Difference:", (Date.now() - FARM[plot].crop.datePlantedAt)) }
          }

          // edit the originally sent message
          msg.edit(`${message.author.username}'s farm!\n${plotsMsgTop + plotsMsg}`)
        })
      }
    })

  })
}
// [["S", 0, true, ["S", 0, true, ["S", 0, true]]], 0, true]