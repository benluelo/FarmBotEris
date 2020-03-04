/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  const cmd = bot.addCommand("usertest", (message, args) => {
    if (!bot.ownersIDs.includes(message.author.id)) { return }
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

  bot.addCommand("usertest2", (message, args) => {
    if (!bot.ownersIDs.includes(message.author.id)) { return }
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
  }, cmd)
}