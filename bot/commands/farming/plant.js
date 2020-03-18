const cropData = require("../../lib/crop-data.js")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.addCommand("plant", async (message, args, userdata) => {

    const plot = args[0]
    const crop = args[1]

    // check specified plot
    if (!plot) { return message.send(new bot.Embed().uhoh("You have to specify a plot to plant on!")) }
    if (crop && plot) {

      // check if input is valid
      const plotNumber = parsePlotNumber(plot)
      if (!cropData[crop] || !userdata.seeds.common[crop].discovered) { return message.send(new bot.Embed().uhoh("Please include a valid plant type")) }
      if (false !== plotNumber) {

        if (plotNumber >= userdata.farm.length) {
          return message.send(new bot.Embed().uhoh("You don't own that plot!"))
        }
        if ("dirt" != userdata.farm[plotNumber].crop.planted) {
          return message.send(new bot.Embed().uhoh(`There's already a crop planted on plot #\`${plot}\`!`))
        }
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
          {
            $set: {
              [`farm.${plotNumber}.crop.planted`] : crop,
              [`farm.${plotNumber}.crop.datePlantedAt`] : Date.now()
            }
          }
        )
        return message.send(new bot.Embed().success(`Planted ${cropData[crop].emoji} on \`${plot.charAt(0).toUpperCase() + plot.slice(1)}\`!`))
      } else {
        return message.send(new bot.Embed().uhoh("Invalid input! Please try again with the format `<letter><number> <plant>`."))
      }
    } else {
      return message.send(new bot.Embed().uhoh("You have to specify a crop to plant!"))
    }
  }, {
    description: "Plants a seed on the specified plot.",
    usage: "​farm plant <plot> <seed>",
    examples: "​farm plant a1 apple",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  }).subcommand("all", (message, args, userdata) => {

    const crop = args[0]

    if (!crop) { return message.send(new bot.Embed().uhoh("Please specify the crop you want to plant!")) }
    if (!cropData[crop] || !userdata.seeds.common[crop].discovered) { return message.send(new bot.Embed().uhoh(`Couldn't find **${crop}** seeds in your seedbag... maybe you mispelled it?`)) }

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
      if (totalPlots == 0) {
        return msg.edit({
          content: "",
          ...new bot.Embed().uhoh(`There's no more room in your field to plant anything else, **${message.author.username}!**`)
        })
      }
      return  msg.edit({
        content: "",
        ...new bot.Embed().success(`Successfully planted **${totalPlots}** ${cropData[crop].emoji}!`)
      })
    })
  }, {
    description: "Plants a seed on all available plots.",
    usage: "​farm plant all <seed>",
    examples: "​farm plant all apple",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  })
}