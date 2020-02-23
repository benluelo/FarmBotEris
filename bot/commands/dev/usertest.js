/** @param {import("../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("usertest", (message, args) => {
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) {
        throw err
      }

      if (userdata) {
        console.log(userdata)
      } else {
        console.log("no userdata :(")
      }
    })
  })
}