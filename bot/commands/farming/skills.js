const cropData = require("../../lib/crop-data.js")
const { XPProgressBar, Attachment } = require("../../lib/classes.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
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
            if (!userdata.seeds.common[seed].discovered) { continue }
            const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5)

            if (process.env.DEBUG === "true") { console.log(XPBar.show()) }

            skillsEmbed.addField(cropData[seed].emoji, `Level: **${XPBar.level()}**` + "\n" + XPBar.show(), true)
          }
          return message.send(skillsEmbed)
        } else {
          const crop = args[0]
          if (cropData[crop] && userdata.seeds.common[crop].discovered) {
            const attachment = new Attachment(crop)
            const XPBar = new XPProgressBar(userdata.seeds.common[crop].level)
            const seedSkillEmbed = new bot.embed()
              .setAuthor(message.author.username, null, message.author.avatarURL)
              .setColor(bot.color.lightgreen)
              .setTitle(`${crop[0].toUpperCase() + crop.substr(1)}`)
              .setThumbnail(attachment.link())
              .addField(`Level: **${XPBar.level()}**`, XPBar.show())

            return message.send(seedSkillEmbed, attachment.send())
          } else {
            return message.send(new bot.embed().uhoh(`**${crop}** isn't one of your crops!`))
          }
        }
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(5000))
}