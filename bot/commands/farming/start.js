const EmbedPaginator = require("eris-pagination")
const flags = require("../../lib/flags.json")
const { User } = require("../../lib/user.js")

// console.log(PERMISSIONS)

/** @param {import("../../lib/FarmBotClient")} bot */
exports.run = (bot) => {
  bot.registerCommand("start", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (!userdata) {

        if (!args[0]) {

          const myEmbeds = []

          let count = 0
          let embed = new bot.embed({ title: "Send `farm start <region>` to start farming!" })
          for (const flag in flags) {
            count++
            embed.addField(flag.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "), flags[flag], true)

            if (12 === count) {
              count = 0
              myEmbeds.push(embed.showContent())
              embed = new bot.embed({ title: "Send `farm start <region>` to start farming!" })
            }
          }
          if (0 !== count) {
            myEmbeds.push(embed.showContent())
          }

          return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
        } else {
          const region = args.join(" ").toLowerCase()
          if (!flags[region]) { return message.send(new bot.embed().uhno(`Couldn't find **"${region}"** anywhere on a map... maybe try somewhere else?`)) }
          const farmers = await require("../../lib/get-farmers.js").run(region)
          bot.database.Userdata.insertOne(new User(message.author, region, farmers))
          message.send(new bot.embed()
            .setTitle(`Welcome to ${bot.user.username}, ${message.author.username}! ${flags[region]}`)
            .setDescription("Do `farm help` to display the full list of commands the bot has!")
            .setColor(bot.color.lightgreen)
          )
        }
      }
      if (userdata) {
        message.send(new bot.embed().uhoh(`You've already started farming, ${message.author.username}!`))
      }
    })
  }, bot.cooldown(5000))
}