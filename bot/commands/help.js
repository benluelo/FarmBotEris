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
      bot.createMessage(message.channel.id, {
        embed: {
          title: "Help Command",
          description: "A full list of commands",
          color: 0xFF000,
          fields: [
            {
              name: "General",
              value: "`help`"
            }
          ]
        }
      })
    } else {
      if (args[0] == "help") {
        sendHelp("Help", "To show help for all the commands in the bot", "f!help `[command name]`")
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
