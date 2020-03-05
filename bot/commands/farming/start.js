const EmbedPaginator = require("eris-pagination")
const flags = require("../../lib/flags.json")
const { User } = require("../../lib/user.js")

// console.log(PERMISSIONS)

/** @private @param {import("../../lib/FarmBotClient")} bot */
exports.run = (bot) => {
  bot.addCommand("start", (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {

      // const country = args.join(" ").toLowerCase()
      if (err) { bot.log.error(err) }

      if (!userdata) {

        if (!args[0]) {

          const myEmbeds = []

          let count = 0
          let embed = new bot.Embed({ title: "Send `farm start <region>` to start farming!" })
          for (const flag in flags) {
            count++
            embed.addField(flag.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "), flags[flag], true)

            if (count === 12) {
              count = 0
              myEmbeds.push(embed.showContent())
              embed = new bot.Embed({ title: "Send `farm start <region>` to start farming!" })
            }
          }
          if (0 !== count) {
            myEmbeds.push(embed.showContent())
          }

          return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
        } else {
          const region = args.join(" ").toLowerCase()
          if (!flags[region]) { return message.send(new bot.Embed().uhoh(`Couldn't find **"${region}"** anywhere on a map... maybe try somewhere else?`)) }
          const farmers = await require("../../lib/get-farmers.js").run(region)
          bot.database.Userdata.insertOne(new User(message.author, region, farmers))
          message.send(new bot.Embed()
            .setTitle(`Welcome to ${bot.user.username}, ${message.author.username}!  ${flags[region]}`)
            .setDescription("Do `farm help` to display the full list of commands the bot has!")
            .setColor(bot.color.lightgreen)
          )
        }
      }
      if (userdata) {
        message.send(new bot.Embed().uhoh(`You've already started farming, ${message.author.username}!`))
      }
    })
  })
}