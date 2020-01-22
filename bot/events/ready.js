const chalk = require("chalk")

exports.run = async (bot) => {
  bot.editStatus("online", {
    name: `farming in ${bot.guilds.size} servers!`,
    type: 0
  })
  console.log(chalk.green.underline("Bot Online!"))
}