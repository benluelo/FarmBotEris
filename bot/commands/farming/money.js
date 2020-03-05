/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("money", (message) => {
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const moneyEmbed = new bot.Embed()
          .setAuthor(message.author.username, null, message.author.avatarURL)
          .setColor(bot.color.lightgreen)
          .setDescription(`Balance: **${bot.formatMoney(userdata.money)}**`)
        message.send(moneyEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  })
  // bot.registerCommandAlias("cash", "money")
}