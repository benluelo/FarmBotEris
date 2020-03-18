exports.run = async (bot) => {
  bot.editStatus("online", {
    name: `farming in ${bot.guilds.size} servers!`,
    type: 0
  })
  setImmediate(() => {
    bot.log.connect("Bot Online!")
  })
}