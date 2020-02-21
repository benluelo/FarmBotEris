const ms = require("parse-ms")
const { Embed } = require("../../../lib/classes")

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

exports.run = (bot) => {
  bot.registerCommand("market", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, (err, userdata) => {
      if (err) { throw err }

      if (!userdata) {
        bot.startMessage(message)
      }

      if (userdata) {

      }
    })
    const marketEmbed = new Embed()
  }, bot.cooldown(15000))
}