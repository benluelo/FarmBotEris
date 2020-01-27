exports.run = async (bot, err, id) => {
  bot.log.error(JSON.stringify(err, null, 4) + "\nERROR ID: " + id)
}