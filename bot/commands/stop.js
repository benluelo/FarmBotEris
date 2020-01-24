exports.run = (bot) => {
  bot.registerCommand("stop", (message, args) => {
    if (args.length == 0) {
      const stopEmbed = {
        embed: {
          title: "Stopping Bot",
          description: `${bot.user.username} disconnecting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`,
          color: 0xFF0000 
        }
      } 
      bot.createMessage(message.channel.id, stopEmbed)
      setTimeout(() => { bot.disconnect() }, 5000)
    } else if (args[0] == "restart") {
      const restartEmbed = {
        embed: {
          title: "Restarting Bot",
          description: `${bot.user.username} Restarting in 10 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`,
          color: 0xFF0000 
        }
      }
      bot.createMessage(message.channel.id, restartEmbed)
      setTimeout(() => { bot.disconnect({reconnect: "auto"}) }, 10000)
    }
  }, {
    requirements: {
      userIDs: bot.ownersIDS
    }
  })
}