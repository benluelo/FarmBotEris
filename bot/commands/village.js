const { Embed } = require("../lib/classes")

module.exports.run = bot => {
  bot.registerCommand("village", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }
      if (userdata) {
        let villageEmbed = new Embed()

        for (const farmer in userdata.farmers) {
          villageEmbed.addField(userdata.farmers[farmer].emoji + " " + userdata.farmers[farmer].name, "test", true)
        }
        bot.createMessage(message.channel.id, villageEmbed.show())
      }
    })
  })
}