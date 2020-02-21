const { Embed, XPProgressBar } = require("../../../lib/classes")

module.exports.run = bot => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("village", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }
      if (userdata) {
        let villageEmbed = new Embed().setColor(bot.color.lightgreen).setTitle(`${message.author.username}'s Village!   ${userdata.region.flag}`)

        for (const farmer in userdata.farmers) {
          const pbar = new XPProgressBar(userdata.farmers[farmer].level, 10, userdata.farmers[farmer].wealth + 2)
          villageEmbed.addField(userdata.farmers[farmer].name, userdata.farmers[farmer].emoji + " Level  **" + pbar.level() + "**\n" + pbar.show(), true)
        }
        bot.createMessage(message.channel.id, villageEmbed)
      }
    })
  })
}