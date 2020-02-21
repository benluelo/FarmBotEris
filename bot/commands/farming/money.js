const { Embed } = require("../../lib/classes")
const emoji = require("../../lib/emoji.json")
exports.run = bot => {
  bot.registerCommand("money", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) bot.log.error(err)
      if (userdata) {
        const moneyEmbed = new Embed()
          .setAuthor(message.author.username, message.author.avatarURL)
          .setColor(bot.color.lightgreen)
          .setDescription(`Balance: **${bot.formatMoney(userdata.money)}** ${emoji.coin}`)
        bot.createMessage(message.channel.id, moneyEmbed)
      }

      if (!userdata) {
        bot.startMessage(message)
        return
      }
    })
  }, bot.cooldown(15000))
  bot.registerCommandAlias("cash", "money")
}
