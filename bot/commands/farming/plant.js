const cropData = require("../../lib/crop-data.js")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")

/** @param {import("../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("plant", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }

      const plot = args[0]
      const crop = args[1]

      // check specified plot
      if (!plot) { return bot.createMessage(message.channel.id, "You have to specify a plot to plant on!") }
      if (crop && plot) {

        // check if input is valid
        const plotNumber = parsePlotNumber(plot)
        const truePlant = Object.keys(userdata.seeds.common).includes(crop)
        if (false !== plotNumber && truePlant) {

          if (!userdata) {
            return bot.startMessage(message)
          }
          if (userdata) {
            if (plotNumber >= userdata.farm.length) {
              return bot.createMessage(message.channel.id, "You don't own that plot!")
            }
            if ("dirt" != userdata.farm[plotNumber].crop.planted) {
              return bot.createMessage(message.channel.id, `There's already a crop planted on plot \`${plot}\`!`)
            }
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
              {
                $set: {
                  [`farm.${plotNumber}.crop.planted`] : crop,
                  [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
                }
              }
            )
            return bot.createMessage(message.channel.id, `Planted ${cropData[crop].emoji} on \`${plot}\`!`)
          }
        } else {
          return bot.createMessage(message.channel.id, "Invalid input! Please try again with the format `<letter><number> <plant>`.")
        }
      } else {
        return bot.createMessage(message.channel.id, "You have to specify a crop to plant!")
      }
    })
  }, bot.cooldown(5000)).registerSubcommand("all", (message, args) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }
      if (!userdata) {
        return bot.startMessage(message)
      }

      if (!args[0]) { return bot.createMessage(message.channel.id, "Please add the plant you want to plant") }
      if (!cropData[args[0]]) { return bot.createMessage(message.channel.id, "Please include a valid plant type") }
      if (!userdata.seeds.common[args[0]].discovered) { return } // silent quit

      return bot.createMessage(message.channel.id, "Planting all!").then(async (msg) => {

        let totalPlots = 0

        if (userdata) {
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
          msg.edit(`Successfully planted ${totalPlots} plots!`)
        }
      })
    })

  }, bot.cooldown(15000))
}