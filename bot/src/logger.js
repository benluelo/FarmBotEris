const chalk = require("chalk")

const log = {
  connect(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][CONNECT][${new Date(Date.now()).toString()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  dbconnect(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][DB CONNECT][${new Date(Date.now()).toString()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  error(...args){
    process.stdout.write(chalk.bgRed.black(`[LOG][ERROR][${new Date(Date.now()).toString()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  toFile(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][TO FILE][${new Date(Date.now()).toString()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
}

module.exports = {
  log
}