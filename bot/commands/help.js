const { Embed } = require("../lib/classes")
exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {

    // Function to send more detailed info about commands
    const sendHelp = (commandName, description, usage) => {
      bot.createMessage(message.channel.id, new Embed()
        .setTitle(`${commandName} Command`)
        .setDescription(description)
        .addField("Usage", usage)
        .setFooter("[] - optional  |  <> - required")
        .show()
      )
    }

    // if <PREFIX>help was typed
    if (args.length == 0) {
      const helpEmbed = new Embed()
        .setTitle("Help Command")
        .setDescription("A full list of commands")
        .setColor(bot.color.lightgreen)
        .addField(":seedling: General", "`buy`, `money`, `plots`")
        .addField(":gear: Utility", "`botinfo`, `help`, `ping`")

      // checks to see if it should add more info
      if (message.author.id == bot.ownersIDS[0] || message.author.id == bot.ownersIDS[1]) {
        helpEmbed.addField(":avocado: Admin", "`eval`, `stop`")
      }
      if (process.env.DEVELOPMENT == "true") {
        helpEmbed.addField(":scroll: Development", "`deleteuser`")
      }

      bot.createMessage(message.channel.id, helpEmbed.show())
    } else {
      // detailed commands
      if (args[0] == "botinfo") {
        sendHelp("Botinfo", "To display infomation about the bot", "f!botinfo")
      }
      if (args[0] == "eval") {
        sendHelp("Eval", "Eval any JS code", "f!eval <code>")
      }
      if (args[0] == "help") {
        sendHelp("Help", "To show help for all the commands in the bot", "f!help `[command name]`")
      }
      if (args[0] == "ping") {
        sendHelp("Ping", "Shows the response time from the bot to Discord", "f!ping")
      }
      if (args[0] == "stop") {
        sendHelp("Stop", "Stops or restarts the bot", "f!stop [restart]")
      }
    }

  }, bot.cooldown(15000))
}
