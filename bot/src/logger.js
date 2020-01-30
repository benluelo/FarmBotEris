const chalk = require("chalk")
const fs = require("fs")
const { basename } = require("path")
const { get } = require("stack-trace")


const outFileName = "toFileLogs"
const toFileStream = fs.createWriteStream(`${process.cwd()}/bot/logs/${outFileName}`, {
  encoding: "utf-8",
  flags: "a+"
})

/**
 * Gets the date and returns it in a readable format for logging to the console.
 * @returns {String}
 */
const getDate = () => {
  const date = new Date()
  return date.toLocaleString()
}

const log = {
  /** 
   * The default log; logs to the console in cyan.
   * @param  {...any} args - what you would like to log.
   */
  default(...args){
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.cyan(`[LOG][DEFAULT][${getDate()}]`),
      args.join(" ")
    )
  },
  connect(...args){
    /** 
     * Log for when the bot connects; logs to the console in green.
     * @param  {...any} args - what you would like to log.
     */
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.green(`[LOG][CONNECT][${getDate()}]`),
      args.join(" ")
    )
  },
  /** 
   * Log for when the database connects; logs to the console in lime.
   * @param  {...any} args - what you would like to log.
   */
  dbconnect(...args){
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("lime")(`[LOG][DBCONNECT][${getDate()}]`),
      args.join(" ")
    )
  },
  /**
   * Log the commands being loaded into the bot
   * @param  {...any} args - cmd that was loaded
   */
  loadedCmd(...args){
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("cyan")(`[LOG][CMD LOAD][${getDate()}]`),
      args.join(" ")
    )
  },
  /**
   * Log for when there is an error; logs both to a file with the name of the ISO timestamp
   * that the function was called at and to the console (in red).
   * @param {...any} args - what you would like to log.
   */
  error(...args){ 
    // get().forEach(callSite => {
    //   console.log(callSite.getFileName())
    // })
    const p = basename(get()[1].getFileName())
    const fileName = `${new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-")}.txt`
    console.log(
      chalk.white.bold(`${p}:`),
      chalk.red(`[LOG][ERROR][${getDate()}]`),
      chalk.red.bold(`${fileName}:`),
      args.join(" ")
    )
    fs.writeFile(`${process.cwd()}/bot/logs/errors/${fileName}`, p + "\n" + args.join("\n"), err => {
      if (err) { throw err }
      console.log(
        chalk.red.bold(`${fileName}:`),
        "Saved!"
      )
    })
  },
  /** 
   * Logs to a file for use in long-term debugging and/or statstics. Also logs to the 
   * console, in yellow.
   * @param  {...any} args - what you would like to log.
   */
  toFile(...args){
    const p = basename(get()[1].getFileName())
    console.log(
      chalk.white.bold(`${p}:`),
      chalk.yellow(`[LOG][TO FILE][${getDate()}]`),
      args.join(" ")
    )
    toFileStream.write(p + " | " + args.join("\n")+ "\n")
  },
}

module.exports = {
  log
}