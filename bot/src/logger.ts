import chalk from "chalk"
import fs, { mkdirSync } from "fs"
import { basename, join } from "path"
import { get } from "stack-trace"

const outFileName = "toFileLogs"
mkdirSync(join(process.cwd(), "../logs/"))
const toFileStream = fs.createWriteStream(`${process.cwd()}/bot/logs/${outFileName}.txt`, {
  encoding: "utf-8",
  flags: "a+"
})

/**
 * @description Gets the date and returns it in a readable format for logging to the console.
 * @returns A readable date.
 */
function currentTimestamp(): string {
  const date = new Date()
  return date.toLocaleString("en-CA", { timeZone: "Canada/Eastern" })
}

export default class Log {
  /**
   * @description The default log; logs to the console in cyan.
   * @param args - What you would like to log.
   */
  static default(...args: any[]) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.cyan(`[LOG][DEFAULT][${currentTimestamp()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when the bot connects; logs to the console in green.
   * @param args - What you would like to log.
   */
  static connect(...args: any[]) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.green(`[LOG][CONNECT][${currentTimestamp()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when the database connects; logs to the console in lime.
   * @param args - What you would like to log.
   */
  static dbconnect(...args: any[]) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("lime")(`[LOG][DBCONNECT][${currentTimestamp()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log the commands being loaded into the bot.
   * @param args - Command that was loaded.
   */
  static commandLoad(...args: any[]) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.keyword("cyan")(`[LOG][CMD LOAD][${currentTimestamp()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log the directory of commands being loaded into the bot.
   * @param args - Directory that was loaded.
   */
  static directoryLoad(...args: any[]) {
    console.log(
      chalk.white.bold(`${basename(get()[1].getFileName())}:`),
      chalk.blue(`[LOG][DIR LOAD][${currentTimestamp()}]`),
      args.join(" ")
    )
  }
  /**
   * @description Log for when there is an error; logs both to a file with the name of the ISO timestamp
   * that the function was called at and to the console (in red).
   * @param args - What you would like to log.
   */
  static error(...args: any[]) {
    const errorFile = basename(get()[1].getFileName())
    const fileName = `${new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-")}.txt`
    console.log(
      chalk.white.bold(`${errorFile}:`),
      chalk.red(`[LOG][ERROR][${currentTimestamp()}]`),
      chalk.red.bold(`${fileName}:`),
      args.join(" ")
    )
    fs.writeFileSync(join(process.cwd(), "/bot/logs/errors/", fileName), `${errorFile}\n${args.join("\n")}`)
    console.log(
      chalk.white.bold(`${errorFile}:`),
      chalk.red.bold(`${fileName}:`),
      "Saved!"
    )
  }
  /**
   * @description Logs to a file for use in long-term debugging and/or statistics. Also logs to the console, in yellow.
   * @param args - What you would like to log.
   */
  static toFile(...args: any[]) {
    const errorFile = basename(get()[1].getFileName())
    console.log(
      chalk.white.bold(`${errorFile}:`),
      chalk.yellow(`[LOG][TO FILE][${currentTimestamp()}]`),
      args.join(" ")
    )
    toFileStream.write(`${errorFile} | ${args.join("\n")}\n`)
  }
}