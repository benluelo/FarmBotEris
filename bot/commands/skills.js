const { Embed, XPProgressBar } = require("../lib/classes.js")

module.exports.run =  (bot) => {
  bot.registerCommand("skills", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          let msg = new Embed()
          for (const seed in userdata.seeds.common) {
            msg.addField(bot.plants[seed], `Level: **${bot.getLevel(userdata.seeds.common[seed].level)}**`, true)
          }
          return bot.createMessage(message.channel.id, msg.show())
        } else {
          console.log(bot.plants[args[0]])
          if (bot.plants[args[0]]) {
            const XPBar = new XPProgressBar(userdata.seeds.common[args[0]].level)
            let msg = new Embed()
              .setTitle(bot.plants[args[0]])
              .addField(`Level: **${bot.getLevel(userdata.seeds.common[args[0]].level)}**`, XPBar.show())
            return bot.createMessage(message.channel.id, msg.show())
          } else {
            return bot.createMessage(message.channel.id, `**${args[0]}** isn't a crop!`)
          }
        }
      }
    })
  })
}