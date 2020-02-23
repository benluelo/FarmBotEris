const cropData = require("../../lib/crop-data.js")
const { Embed, XPProgressBar, Attachment } = require("../../lib/classes.js")

/** @param {import("../../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("skills", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, /** @param {import("../../lib/user.js").UserData} userdata */ async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          const msg = new Embed()
          for (const seed in userdata.seeds.common) {
            const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5)

            if (process.env.DEBUG === "true") { console.log(XPBar.show()) }

            msg.addField(cropData[seed].emoji, `Level: **${XPBar.level()}**` + "\n" + XPBar.show(), true)
          }
          return bot.createMessage(message.channel.id, msg)
        } else {
          if (cropData[args[0]]) {
            const attachment = new Attachment(args[0])
            const XPBar = new XPProgressBar(userdata.seeds.common[args[0]].level)
            const msg = new Embed()
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