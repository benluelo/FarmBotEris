const chalk = require("chalk")

const getDate = () => {
  const date = new Date()
  return date.toLocaleString()
}

const log = {
  connect(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][CONNECT][${getDate()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  dbconnect(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][DB CONNECT][${getDate()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  error(...args){
    process.stdout.write(chalk.bgRed.black(`[LOG][ERROR][${getDate()}]`) + " ", () => {
      args.forEach(arg => {
        process.stdout.write(arg + " ")
      })
      process.stdout.write("\n")
    })
  },
  toFile(...args){
    process.stdout.write(chalk.bgGreen.black(`[LOG][TO FILE][${getDate()}]`) + " ", () => {
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