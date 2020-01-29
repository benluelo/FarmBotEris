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
        bot.log.toFile("money test")
      }

      if (!userdata) {
        bot.createMessage(
          message.channel.id,
          `You haven't started farming yet, ${message.author.username}! Send \`farm start\` to start farming!`
        )
      }
    })
  }, bot.cooldown(15000))
}
