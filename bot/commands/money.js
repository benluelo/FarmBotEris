exports.run = bot => {
  bot.registerCommand("money", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) bot.log.error(err)
      if (userdata) {
        const moneyEmbed = {
          embed: {
            author: {
              name: message.author.username,
              icon_url: message.author.avatarURL
            },
            color: bot.color.lightgreen,
            description: `Balance: **${bot.formatMoney(userdata.money)}** <:farmbot_coin:648032810682023956>`
          }
        }
        bot.createMessage(message.channel.id, moneyEmbed)
        //bot.log.toFile("money test")      - crashes bot
      }

      if (!userdata) {
        bot.startMessage(message)
        return
      }
    })
  }, bot.cooldown(15000))
  bot.registerCommandAlias("cash", "money")
}
