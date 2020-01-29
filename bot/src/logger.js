const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const stackTrace = require("stack-trace")


const outFileName = "toFileLogs"
const toFileStream = fs.createWriteStream(`${process.cwd()}/bot/logs/${outFileName}`, {
  encoding: "utf-8",
  flags: "a+"
})

const getDate = () => {
  const date = new Date()
  return date.toLocaleString()
}

const log = {
  default(...args){
    console.log(
      chalk.white.bold(`${path.basename(stackTrace.get()[1].getFileName())}:`),
      chalk.cyan(`[LOG][DEFAULT][${getDate()}]`),
      args.join(" ")
    )
  },
  connect(...args){
    console.log(
      chalk.white.bold(`${path.basename(stackTrace.get()[1].getFileName())}:`),
      chalk.green(`[LOG][CONNECT][${getDate()}]`),
      args.join(" ")
    )
  },
  dbconnect(...args){
    console.log(
      chalk.white.bold(`${path.basename(stackTrace.get()[1].getFileName())}:`),
      chalk.greenBright(`[LOG][DBCONNECT][${getDate()}]`),
      args.join(" ")
    )
  },
  error(...args){ 
    // stackTrace.get().forEach(callSite => {
    //   console.log(callSite.getFileName())
    // })
    const p = path.basename(stackTrace.get()[1].getFileName())
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
  toFile(...args){
    const p = path.basename(stackTrace.get()[1].getFileName())
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