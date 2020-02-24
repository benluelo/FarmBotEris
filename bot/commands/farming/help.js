const { Embed } = require("../../lib/classes")

/** @param {import("../../../index.js").Bot} bot */
exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {

    // Function to send more detailed info about commands
    const sendHelp = (commandName, description, usage) => {
      bot.createMessage(message.channel.id, new Embed()
        .setTitle(`${commandName} Command`)
        .setDescription(description)
        .addField("Usage", usage)
        .setFooter("[] - optional  |  <> - required")

      )
    }

    // if <PREFIX>help was typed
    if (0 == args.length) {
      const helpEmbed = new Embed()
        .setTitle("Help Command")
        .setDescription("A full list of commands")
        .setColor(bot.color.lightgreen)
        .addField(":seedling: General", "`buy`, `money`, `plots`")
        .addField(":gear: Utility", "`botinfo`, `help`, `ping`")

      // checks to see if it should add more info
      if (message.author.id == bot.ownersIDs[0] || message.author.id == bot.ownersIDs[1]) {
        helpEmbed.addField(":avocado: Admin", "`eval`, `stop`")
      }
      if ("true" == process.env.DEVELOPMENT) {
        helpEmbed.addField(":scroll: Development", "`deleteuser`")
      }

      bot.createMessage(message.channel.id, helpEmbed)
    } else {
      // detailed commands
      if ("botinfo" == args[0]) {
        sendHelp("Botinfo", "To display infomation about the bot", "f!botinfo")
      }
      if ("eval" == args[0]) {
        sendHelp("Eval", "Eval any JS code", "f!eval <code>")
      }
      if ("help" == args[0]) {
        sendHelp("Help", "To show help for all the commands in the bot", "f!help `[command name]`")
      }
      if ("ping" == args[0]) {
        sendHelp("Ping", "Shows the response time from the bot to Discord", "f!ping")
      }
      if ("stop" == args[0]) {
        sendHelp("Stop", "Stops or restarts the bot", "f!stop [restart]")
      }
    }

  }, bot.cooldown(15000))
}
