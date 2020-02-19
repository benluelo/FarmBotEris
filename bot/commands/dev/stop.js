const { Embed } = require("../../lib/classes")
exports.run = (bot) => {
  bot.registerCommand("stop", (message, args) => {
    if (args.length == 0) {
      const stopEmbed = new Embed()
        .setTitle("Stopping Bot")
        .setDescription(`${bot.user.username} disconnecting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
        .setColor(bot.color.red)

      bot.createMessage(message.channel.id, stopEmbed.show())
      setTimeout(() => { bot.disconnect(); process.exit(0) }, 5000)
    } else if (args[0] == "restart") {
      const restartEmbed = new Embed()
        .setTitle("Restarting Bot")
        .setDescription(`${bot.user.username} restarting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
        .setColor(bot.color.red)

      bot.createMessage(message.channel.id, restartEmbed.show())
      setTimeout(() => { bot.disconnect({reconnect: "auto"}) }, 10000)
    }
  }, {
    requirements: {
      userIDs: bot.ownersIDS
    }
  })
}