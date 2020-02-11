const { Embed } = require("../lib/classes")
const { readdir } = require("fs")
const commands = []

readdir("./bot/help", async (err, files) => {
  if (err) throw err
  files.forEach(async (file) => {
    const fSplit = file.split(".")
    if (fSplit[1] !== "json") { return }
    commands.push(fSplit[0])
  })
})

exports.run = (bot) => {
  bot.registerCommand("help2", (message, args) => {
    if (!args[0]) {
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
      if (commands.includes(args[0])) {
        const command = require(`../help/${args[0]}.json`)
        const helpEmbed = new Embed()
          .setTitle(command.title)
          .setDescription(command.description)
          .addField(command.usage.name, command.usage.value)
          .addField(command.examples.name, command.examples.value)
          .setFooter("[] - optional  |  <> - required")
        return bot.createMessage(message.channel.id, helpEmbed.show())
      } else {
        bot.createMessage(message.channel.id, `${args[0]} isn't a command!`)
      }
    }
  }, bot.cooldown(15000))
}