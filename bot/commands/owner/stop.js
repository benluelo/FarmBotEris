exports.run = (bot) => {
  bot.registerCommand("stop", (message, args) => {
    if (args.length == 0) {
      const stopEmbed = new bot.embed()
        .setTitle("Stopping Bot")
        .setDescription(`${bot.user.username} disconnecting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
        .setColor(bot.color.red)

      message.send(stopEmbed)
      setTimeout(() => { bot.disconnect(); process.exit(0) }, 5000)
    } else if (args[0] == "restart") {
      const restartEmbed = new bot.embed()
        .setTitle("Restarting Bot")
        .setDescription(`${bot.user.username} restarting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
        .setColor(bot.color.red)

      message.send(restartEmbed)
      setTimeout(() => { bot.disconnect({ reconnect: "auto" }) }, 10000)
    }
  }, {
    requirements: {
      userIDs: bot.ownersIDs
    }
  })
}