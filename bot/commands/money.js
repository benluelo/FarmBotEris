exports.run = bot => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("money", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) bot.log.error(err)
      if (userdata) {
        bot.createMessage(
          message.channel.id,
          `${message.author.username}'s balance: **${userdata.money}** <:farmbot_coin:648032810682023956>`
        )
        //bot.log.toFile("money test")      - crashes bot
      }

      if (!userdata) {
        bot.startMessage(message)
        return
      }
    })
  }, bot.cooldown(15000))
}
