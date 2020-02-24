const emoji = require("../../lib/emoji.json")

/** @param {import("../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("money", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const moneyEmbed = new bot.embed()
          .setAuthor(message.author.username, null, message.author.avatarURL)
          .setColor(bot.color.lightgreen)
          .setDescription(`Balance: **${bot.formatMoney(userdata.money)}** ${emoji.coin}`)
        bot.createMessage(message.channel.id, moneyEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(15000))
  bot.registerCommandAlias("cash", "money")
}
