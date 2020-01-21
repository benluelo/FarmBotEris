const eris = require('eris')
const chalk = require('chalk')
require('dotenv').config()

let bot = new eris(process.env.TOKEN)

bot.on('ready', () => {
    console.log(chalk.bgGreenBright.black('Logged in!'))
})

bot.on('messageCreate', message => {
    console.log(chalk.bold(message.author.username + ':'), chalk.cyan(message.content))
})

bot.connect()