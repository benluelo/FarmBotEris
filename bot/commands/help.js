exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {

    // Function to send more detailed info about commands
    const sendHelp = (commandName, description, usage) => {
      bot.createMessage(message.channel.id, {
        embed: {
          title: `${commandName} Command`,
          description: description,
          fields: [
            {
              name: "Usage",
              value: usage
            }
          ],
          footer: {
            text: "[] - optional  |  <> - required"
          }
        }
      })
    }

    // if <PREFIX>help was typed
    if (args.length == 0) {
      const helpEmbed = {
        embed: {
          title: "Help Command",
          description: "A full list of commands",
          color: bot.color.lightgreen,
          fields: [
            {
              name: ":seedling: General",
              value: "`buy`, `money`, `plots`"
            },
            {
              name: ":gear: Utility",
              value: "`botinfo`, `help`, `ping`"
            }
          ]
        }
      }

      // checks to see if it should add more info
      if (message.author.id == bot.ownersIDS[0] || message.author.id == bot.ownersIDS[1]) {
        helpEmbed.embed.fields.push({name: ":avocado: Admin",value: "`eval`, `stop`"})
      }
      if (process.env.DEVELOPMENT == "true") {
        helpEmbed.embed.fields.push({name: ":scroll: Development", value: "`deleteuser`"})
      }

      bot.createMessage(message.channel.id, helpEmbed)
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
    
  }, {
    cooldown: 10000,
    cooldownMessage: function() {
      return "cooldown is 10 seconds pls slow down"
    },
    cooldownExclusions: {
      channelIDs: [
        "669353094953435183" // dev stuff > #test-test
      ]
    }
  })
}
