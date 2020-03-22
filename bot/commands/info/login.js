/** @private @param {import("../..//lib/FarmBotClient.js")} bot */
exports.run = async (bot) => {
  bot.addCommand("login", async (message, args, userdata) => {
    (await message.author.getDMChannel()).createMessage(`http://localhost:4000/login/${userdata.uuid}.${userdata.userID}`)
  }, {
    description: "Log in to the FarmBot website.",
    usage: "​farm login",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.UTILITY,
    cooldown: 30000
  })
}