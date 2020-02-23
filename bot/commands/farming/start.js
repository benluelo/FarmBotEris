const { Embed } = require("../../lib/classes")
const EmbedPaginator = require("eris-pagination")
const flags = require("../../lib/flags.json")
const { User } = require("../../lib/user.js")

/** @param {import("../../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("start", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, /** @param {import("../../lib/user.js").UserData} userdata */ async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (!userdata) {

        if (!args[0]) {

          const myEmbeds = []

          let count = 0
          let embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
          for (const flag in flags) {
            count++
            embed.addField(flag, flags[flag], true)

            if (12 === count) {
              count = 0
              myEmbeds.push(embed.showContent())
              embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
            }
          }
          if (0 !== count) {
            myEmbeds.push(embed.showContent())
          }

          return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
        } else {
          const region = args.join(" ").toLowerCase()
          if (!flags[region]) { return bot.createMessage(message.channel.id, `${region} is not a valid region!`) }
          const farmers = await require("../../lib/get-farmers.js").run(region)
          bot.database.Userdata.insertOne(new User(message.author, region, farmers))
          bot.createMessage(message.channel.id, new Embed()
            .setTitle(`Welcome to ${bot.user.username}, ${message.author.username}! ${flags[region]}`)
            .setDescription("Do `f!help` to display the full list of commands the bot has!")
            .setColor(bot.color.lightgreen)
          )
        }
      }
      if (userdata) {
        bot.createMessage(message.channel.id, `You've already started farming, ${message.author.username}!`)
      }
    })
  }, bot.cooldown(60000))
}