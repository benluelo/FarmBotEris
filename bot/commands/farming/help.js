const help = require("../../lib/help-info.js")

/** @param {import("../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {
    if (!args[0]) {
      const helpEmbed = new bot.embed()
        .setTitle("Help Command")
        .setDescription("A full list of commands")
        .setColor(bot.color.lightgreen)
        .addField(":seedling: General", "`buy`, `harvest`, `inventory`, `market`, `money`, `plant`, `plots`, `seeds`, `sell`, `skills`, `village`")
        .addField(":gear: Utility", "`botinfo`, `help`, `info`, `ping`")

      // checks to see if it should add more info
      if (bot.ownersIDs.includes(message.author.id)) {
        helpEmbed.addField(":avocado: Admin", "`eval`, `stop`, `status`")
      }
      if ("true" == process.env.DEVELOPMENT) {
        helpEmbed.addField(":scroll: Development", "`deleteuser`")
      }

      bot.createMessage(message.channel.id, helpEmbed)
    } else {
      const req = helpEmbeds[args[0]]
      if (req) {
        return bot.createMessage(message.channel.id, req)
      } else {
        bot.createMessage(message.channel.id, `${args[0]} isn't a command!`)
      }
    }
  }, bot.cooldown(15000))
}