const chalk = require("chalk")
const fs = require("fs")
const { basename } = require("path")
const { get } = require("stack-trace")


const outFileName = "toFileLogs"
const toFileStream = fs.createWriteStream(`${process.cwd()}/bot/logs/${outFileName}.txt`, {
  encoding: "utf-8",
  flags: "a+"
})

/**
 * @description Gets the date and returns it in a readable format for logging to the console.
 * @returns {String} A readable date.
 */
const getDate = () => {
  const date = new Date()
  return date.toLocaleString("en-CA", { timeZone: "Canada/Eastern" })
}

class Log {
  /**
   * @description The default log; logs to the console in cyan.
   * @param {...} args - What you would like to log.
   */
  static default(...args) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.cyan(`[LOG][DEFAULT][${getDate()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when the bot connects; logs to the console in green.
   * @param  {...} args - What you would like to log.
   */
  static connect(...args) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.green(`[LOG][CONNECT][${getDate()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when the database connects; logs to the console in lime.
   * @param  {...} args - What you would like to log.
   */
  static dbconnect(...args) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("lime")(`[LOG][DBCONNECT][${getDate()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log the commands being loaded into the bot.
   * @param  {...} args - Command that was loaded.
   */
  static commandLoad(...args) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("cyan")(`[LOG][CMD LOAD][${getDate()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log the directory of commands being loaded into the bot.
   * @param  {...} args - Directory that was loaded.
   */
  static directoryLoad(...args) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.blue(`[LOG][DIR LOAD][${getDate()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when there is an error; logs both to a file with the name of the ISO timestamp
   * that the function was called at and to the console (in red).
   * @param {...} args - What you would like to log.
   */
  static error(...args) {
    const p = basename(get()[1].getFileName())
    const fileName = `${new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-")}.txt`
    console.log(
      chalk.white.bold(`${p}:`),
      chalk.red(`[LOG][ERROR][${getDate()}]`),
      chalk.red.bold(`${fileName}:`),
      args.join(" ")
    )
    fs.writeFileSync(`${process.cwd()}/bot/logs/errors/${fileName}`, p + "\n" + args.join("\n"))
    console.log(
      chalk.white.bold(`${p}:`),
      chalk.red.bold(`${fileName}:`),
      "Saved!"
    )
  }
  /**
   * @description Logs to a file for use in long-term debugging and/or statistics. Also logs to the console, in yellow.
   * @param  {...} args - What you would like to log.
   */
  static toFile(...args) {
    const p = basename(get()[1].getFileName())
    console.log(
      chalk.white.bold(`${p}:`),
      chalk.yellow(`[LOG][TO FILE][${getDate()}]`),
      args.join(" ")
    )
    toFileStream.write(p + " | " + args.join("\n") + "\n")
  }
}

module.exports = Log