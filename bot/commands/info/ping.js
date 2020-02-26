exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("ping", (message, args) => {
    const startTime = Date.now()
    message.send("Pinging...").then((msg) => {
      msg.edit(new bot.embed().success("Pong! " + (Date.now() - startTime) + "ms."))
    })
  }, bot.cooldown(5000))
}