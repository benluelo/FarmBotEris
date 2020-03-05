/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand("ping", (message, args) => {
    const startTime = Date.now()
    const e = new bot.Embed().success("Pinging...")
    message.send(e)
      .then((msg) => {
        msg.edit({
          ...e.setDescription("Pong! " + (Date.now() - startTime) + "ms.")
        })
      })
  })
}