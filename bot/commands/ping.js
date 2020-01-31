exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("ping", (message, args) => {
  }, bot.cooldown(5000))
}