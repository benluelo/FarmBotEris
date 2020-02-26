const cropData = require("../../lib/crop-data.js")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")

/** @param {import("../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("plant", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        const plot = args[0]
        const crop = args[1]

        // check specified plot
        if (!plot) { return message.send(new bot.embed().uhoh("You have to specify a plot to plant on!")) }
        if (crop && plot) {

          // check if input is valid
          const plotNumber = parsePlotNumber(plot)
          const truePlant = Object.keys(userdata.seeds.common).includes(crop)
          if (false !== plotNumber && truePlant) {

            if (plotNumber >= userdata.farm.length) {
              return message.send(new bot.embed().uhoh("You don't own that plot!"))
            }
            if ("dirt" != userdata.farm[plotNumber].crop.planted) {
              return message.send(new bot.embed().uhoh(`There's already a crop planted on plot \`${plot}\`!`))
            }
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
              {
                $set: {
                  [`farm.${plotNumber}.crop.planted`] : crop,
                  [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
                }
              }
            )
            return message.send(new bot.embed().success(`Planted ${cropData[crop].emoji} on \`${plot}\`!`))
          } else {
            return message.send(new bot.embed().uhoh("Invalid input! Please try again with the format `<letter><number> <plant>`."))
          }
        } else {
          return message.send(new bot.embed().uhoh("You have to specify a crop to plant!"))
        }
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(5000)).registerSubcommand("all", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        if (!args[0]) { return message.send(new bot.embed().uhoh("Please add the plant you want to plant")) }
        if (!cropData[args[0]]) { return message.send(new bot.embed().uhoh("Please include a valid plant type")) }
        if (!userdata.seeds.common[args[0]].discovered) { return } // silent quit

        return message.send("Planting all!").then(async (msg) => {

          let totalPlots = 0

          for (const plot in userdata.farm) {
            if ("dirt" === userdata.farm[plot].crop.planted) {
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
          msg.edit(new bot.embed().success(`Successfully planted ${totalPlots} plots!`))
        })
      }
    })

  }, bot.cooldown(15000))
}