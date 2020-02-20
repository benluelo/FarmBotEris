const plants = require("../../lib/plants.json")
const cropEmoji = require("../../lib/crop-emoji.json")
const { Embed, XPProgressBar, Attachment } = require("../../lib/classes.js")

module.exports.run =  (bot) => {
  bot.registerCommand("skills", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          let msg = new Embed()
          for (const seed in userdata.seeds.common) {
            const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5)
            console.log(XPBar.show())
            msg.addField(cropEmoji[seed], `Level: **${XPBar.level()}**` + "\n" + XPBar.show(), true)
          }
          return bot.createMessage(message.channel.id, msg)
        } else {
          if (plants.includes(args[0])) {
            const attachment = new Attachment(args[0])
            const XPBar = new XPProgressBar(userdata.seeds.common[args[0]].level)
            let msg = new Embed()
              .setTitle(`${args[0][0].toUpperCase() + args[0].substr(1)}`)
              .setThumbnail(attachment.link())
              .addField(`Level: **${XPBar.level()}**`, XPBar.show())

            return bot.createMessage(message.channel.id, msg, attachment.send())
          } else {
            return bot.createMessage(message.channel.id, `**${args[0]}** isn't a crop!`)
          }
        }
      }
    })
  })
}