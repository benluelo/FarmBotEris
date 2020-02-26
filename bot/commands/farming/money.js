/** @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.registerCommand("money", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const moneyEmbed = new bot.embed()
          .setAuthor(message.author.username, null, message.author.avatarURL)
          .setColor(bot.color.lightgreen)
          .setDescription(`Balance: **${bot.formatMoney(userdata.money)}**`)
        message.send(moneyEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(2000))
  bot.registerCommandAlias("cash", "money")
}