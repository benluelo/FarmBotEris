const { Embed, XPProgressBar } = require("../lib/classes.js")
const fs = require("fs")
const { promisify } = require("util")
const readFile = promisify(fs.readFile)

module.exports.run =  (bot) => {
  bot.registerCommand("skills", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          let msg = new Embed()
          for (const seed in userdata.seeds.common) {
            const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5)
            msg.addField(bot.cropEmoji[seed], `Level: **${bot.getLevel(userdata.seeds.common[seed].level)}**` + "\n" + XPBar.show(), true)
          }
          return bot.createMessage(message.channel.id, msg.show())
        } else {
          // console.log(bot.plants)
          // console.log(bot.cropEmoji[args[0]])
          if (bot.plants.includes(args[0])) {
            const XPBar = new XPProgressBar(userdata.seeds.common[args[0]].level)
            let msg = new Embed()
              .setTitle(`${args[0][0].toUpperCase() + args[0].substr(1)}`)
              .setThumbnail("attachment://image.png")
              .addField(`Level: **${bot.getLevel(userdata.seeds.common[args[0]].level)}**`, XPBar.show())

            const f = await readFile(`./bot/images/png/${args[0]}.png`)
            return bot.createMessage(message.channel.id, msg.show(), [{
              file: f,
              name: "image.png"
            }])
          } else {
            return bot.createMessage(message.channel.id, `**${args[0]}** isn't a crop!`)
          }
        }
      }
    })
  })
}