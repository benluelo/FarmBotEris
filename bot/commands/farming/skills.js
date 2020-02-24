const cropData = require("../../lib/crop-data.js")
const { XPProgressBar, Attachment } = require("../../lib/classes.js")

/** @param {import("../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("skills", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          const skillsEmbed = new bot.embed()
            .setAuthor(message.author.username, null, message.author.avatarURL)
            .setColor(bot.color.lightgreen)

          for (const seed in userdata.seeds.common) {
            const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5)

            if (process.env.DEBUG === "true") { console.log(XPBar.show()) }

            skillsEmbed.addField(cropData[seed].emoji, `Level: **${XPBar.level()}**` + "\n" + XPBar.show(), true)
          }
          return bot.createMessage(message.channel.id, skillsEmbed)
        } else {
          if (cropData[args[0]]) {
            const attachment = new Attachment(args[0])
            const XPBar = new XPProgressBar(userdata.seeds.common[args[0]].level)
            const seedSkillEmbed = new bot.embed()
              .setAuthor(message.author.username, null, message.author.avatarURL)
              .setColor(bot.color.lightgreen)
              .setTitle(`${args[0][0].toUpperCase() + args[0].substr(1)}`)
              .setThumbnail(attachment.link())
              .addField(`Level: **${XPBar.level()}**`, XPBar.show())

            return bot.createMessage(message.channel.id, seedSkillEmbed, attachment.send())
          } else {
            return bot.createMessage(message.channel.id, new bot.embed().error(`**${args[0]}** isn't a crop!`))
          }
        }
      } else {
        bot.startMessage(message)
      }
    })
  })
}