/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("money", (message, args, userdata) => {
    message.send(new bot.Embed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(bot.color.lightgreen)
      .setDescription(`Balance: **${bot.formatMoney(userdata.money)}**`))
  }, {
    description: `View your current ${require("../../lib/emoji.json").coin} balance.`,
    usage: "​farm money",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["cash"],
    cooldown: 2000
  })
}