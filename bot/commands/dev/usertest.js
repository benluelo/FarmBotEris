/** @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.registerCommand("usertest", (message, args) => {
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) {
        throw err
      }

      if (userdata) {
        console.log("userdata! " + userdata.nickname)
      } else {
        console.log("no userdata :(")
      }
    })
  })
}