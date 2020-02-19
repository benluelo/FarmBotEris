const fs = require("fs")
const path = require("path")

exports.run = (bot) => {
  loadCommands(bot, path.join(__dirname, "../commands"))
}

function loadCommands(bot, dirpath, depth=0) {
  let p = dirpath
  fs.readdirSync(p).forEach((file, key, arr) => {
    // console.log(key)
    if (!fs.lstatSync(`${p}/${file}`).isDirectory()) {
      // let command =
      require(`${p}/${file}`).run(bot)
      bot.log.commandLoad(Object.is(arr.length - 1, key)? `${"│  ".repeat(depth)}└──⮞`: `${"│  ".repeat(depth)}├──⮞`, file)
      // command
    } else {
      bot.log.directoryLoad(`├──${"┼──".repeat(depth)}┬ Loading ${file} commands...`)
      loadCommands(bot, `${p}/${file}`, depth + 1)
    }
  })
}
`
├─commands
│ ├─dev
│ ├─farming
│ │ └─npc
│ └─info
├─events
├─help
├─images
│ ├─png
│ └─svg
├─lib
├─logs
│ └─errors
└─src
`