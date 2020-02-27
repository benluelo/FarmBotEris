const cropData = require("../../lib/crop-data.js")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.registerCommand("plant", (message, args) => {

    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        const plot = args[0]
        const crop = args[1]

        // check specified plot
        if (!plot) { return message.send(new bot.embed().uhoh("You have to specify a plot to plant on!")) }
        if (crop && plot) {

          // check if input is valid
          const plotNumber = parsePlotNumber(plot)
          if (!cropData[crop] || !userdata.seeds.common[crop].discovered) { return message.send(new bot.embed().uhoh("Please include a valid plant type")) }
          if (false !== plotNumber) {

            if (plotNumber >= userdata.farm.length) {
              return message.send(new bot.embed().uhoh("You don't own that plot!"))
            }
            if ("dirt" != userdata.farm[plotNumber].crop.planted) {
              return message.send(new bot.embed().uhoh(`There's already a crop planted on plot #\`${plot}\`!`))
            }
            await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
              {
                $set: {
                  [`farm.${plotNumber}.crop.planted`] : crop,
                  [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
                }
              }
            )
            return message.send(new bot.embed().success(`Planted ${cropData[crop].emoji} on \`${plot.charAt(0).toUpperCase() + plot.slice(1)}\`!`))
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

    const crop = args[0]

    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {

        if (!crop) { return message.send(new bot.embed().uhoh("Please specify the crop you want to plant!")) }
        if (!cropData[crop] || !userdata.seeds.common[crop].discovered) { return message.send(new bot.embed().uhoh(`Couldn't find **${crop}** seeds in your seedbag... maybe you mispelled it?`)) }

        return message.send("Planting all!").then(async (msg) => {

          let totalPlots = 0

          for (const plot in userdata.farm) {
            if (userdata.farm[plot].crop.planted === "dirt") {
              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
                $set: {
                  [`farm.${plot}.crop.planted`] : crop,
                  [`farm.${plot}.crop.datePlantedAt`] : Date.now()
                }
              })
              totalPlots++
            }
          }
          msg.edit({
            content: "",
            ...new bot.embed().success(`Successfully planted **${totalPlots}** ${cropData[crop].emoji}!`)
          })
        })
      }
    })

  }, bot.cooldown(5000))
}