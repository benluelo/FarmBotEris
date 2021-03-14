import { FarmBotClient } from "../../lib/FarmBotClient.js"

export default (bot: FarmBotClient) => {
  // eslint-disable-next-line no-unused-vars
  const cmd = bot.addCommand("usertest", (message, _args) => {
    if (!bot.ownersIDs.includes(message.author.id)) { return }
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) {
        throw err
      }

      if (userdata) {
        console.log("userdata! " + userdata.userID)
      } else {
        console.log("no userdata :(")
      }
    })
  }, {})

  cmd.subcommand("usertest2", (message, _args) => {
    if (!bot.ownersIDs.includes(message.author.id)) { return }
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) {
        throw err
      }

      if (userdata) {
        console.log("userdata! " + userdata.userID)
      } else {
        console.log("no userdata :(")
      }
    })
  })
}