const cropData = require("../../lib/crop-data.js")
const { parsePlotNumber } = require("../../lib/parse-plot-number.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  const cmd = bot.addCommand("plant", async (message, args, userdata) => {

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
  })

  cmd.subcommand("all", (message, args, userdata) => {

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

  cmd.subcommand("row", async (message, args, userdata) => {
    if (!args[1]) { return message.send(new bot.Embed().uhoh("Uh-oh! See `farm help plant row` for help on how to use this command.")) }
    const row = args.shift().toLowerCase()
    const crop = args.shift().toLowerCase()

    console.log(row, crop)

    const rows = {
      a: 0,
      b: 5,
      c: 10,
      d: 15,
      e: 20
    }

    if (rows[row] === undefined) { return message.send(new bot.Embed().uhoh(`**${row.toUpperCase()}** isn't a valid row!`)) }

    if (!cropData[crop] || !userdata.seeds.common[crop].discovered) { return message.send(new bot.Embed().uhoh(`**${crop}** isn't a valid crop!`)) }

    if (userdata.farm.length < rows[row]) { return message.send(new bot.Embed().uhoh(`You don't own any plots on row **${row.toUpperCase()}**`)) }

    let totalPlots = 0
    for (let plot = rows[row]; (plot < rows[row] + 5) && (plot < userdata.farm.length); ++plot) {
      console.log(plot, userdata.farm[plot].crop)
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
      return message.send(new bot.Embed().uhoh(`There's no more room on row **${row.toUpperCase()}** to plant anything else, **${message.author.username}!**`))
    }
    return message.send(new bot.Embed().success(`Successfully planted **${totalPlots}** ${cropData[crop].emoji} on row **${row.toUpperCase()}**!`))
  }, {
    description: "Plants a seed on all available plots in the specified row.",
    usage: "​farm plant row <row> <seed>",
    examples: "​farm plant row a apple",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  })
}