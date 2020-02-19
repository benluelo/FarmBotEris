exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("ping", (message, args) => {
    const startTime = Date.now()
    bot.createMessage(message.channel.id, "Pinging...").then((msg) => {
      msg.edit("Pong! " + (Date.now() - startTime) + "ms.")
    })
  }, bot.cooldown(5000))
}