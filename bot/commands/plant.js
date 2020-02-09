const { parsePlotNumber } = require("../lib/parsePlotNumber.js")

exports.run = (bot) => {
  bot.registerCommand("plant", (message, args) => {
    // f!plant <plot> <crop>
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) throw err

      const plot = args[0]
      const crop = args[1]

      // check specified plot
      if (!plot) return bot.createMessage(message.channel.id, "You have to specify a plot to plant on!")
      if (crop && plot) {

        // check if input is valid
        let plotNumber = parsePlotNumber(plot)
        let truePlant = Object.keys(userdata.seeds.common).includes(crop)
        if (plotNumber !== false && truePlant) {

          if (!userdata) {
            bot.startMessage(message)
          }
          if (userdata) {
            if (plotNumber >= userdata.farm.length){
              bot.createMessage(message.channel.id, "You don't own that plot!")
              return
            }
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
              {
                $set: {
                  [`farm.${plotNumber}.crop.planted`] : crop,
                  [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
                }
              }
            )
            bot.createMessage(message.channel.id, `Planted ${bot.plants[crop]} on \`${plot}\`!`)
          }

        } else {
          bot.createMessage(message.channel.id, "Invalid input! Please try again with the format `<plant> <letter><number>`.")
        }
      } else {
        bot.createMessage(message.channel.id, "You have to specify a crop to plant!")
      }
    })

  }, bot.cooldown(5000)).registerSubcommand("all", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {
        bot.startMessage(message)
      }

      if (!args[0]) return bot.createMessage(message.channel.id, "Please add the plant you want to plant")
      if (!Object.keys(userdata.seeds.common).includes(args[0])) return bot.createMessage(message.channel.id, "Please include a vaild plant type")
      if (!userdata.seeds.common[args[0]].discovered) return // slient quit

      bot.createMessage(message.channel.id, "Planting all!").then(async msg => {

        let totalPlots = 0

        if (userdata) {
          for (let plot in userdata.farm) {
            if (userdata.farm[plot].crop.planted === "dirt") {
              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
                {
                  $set: {
                    [`farm.${plot}.crop.planted`] : args[0],
                    [`farm.${plot}.crop.datePlantedAt`] : Date.now()
                  }
                }).then(() => {
                totalPlots += 1
              })
            }
          }
          msg.edit(`Succesfully planted ${totalPlots} plots!`)
        }
      })
    })

  }, bot.cooldown(15000))
}