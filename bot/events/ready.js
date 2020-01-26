exports.run = async (bot) => {
  bot.editStatus("online", {
    name: `farming in ${bot.guilds.size} servers!`,
    type: 0
  })
  setImmediate(() => {
    bot.log.connect("Bot Online!")
    bot.log.error("error test")
    bot.log.toFile("error test")
  })
}