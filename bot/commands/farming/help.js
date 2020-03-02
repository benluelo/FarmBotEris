const help = require("../../lib/help-info.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {
    const req = args.join(" ")
    bot.getUser(message.author.id, (err, userdata) => {

      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!req) { message.send(help.fullHelpEmbeds[userdata.permissions]) }
        else {
          const e = help.commandHelpEmbeds[req]
          if (e) { return message.send(e) }
          else { message.send(new bot.Embed().uhoh(`${req} isn't a command!`)) }
        }
      } else { bot.startMessage(message) }

    })
  }, bot.cooldown(1000))
}