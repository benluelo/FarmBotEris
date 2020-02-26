const { question } = require("readline-sync")
const fs = require("fs")
const path = require("path")

const name = question("file name? ")
const cooldown = question("cooldown length? (ms) ")

let dir = ""
let depth = 0
for (;;) {
  const temp = question(`directory to write to? (commands/${dir}): `)
  console.log(temp)
  if (!temp.trim() == "") {
    dir += temp + "/"
  } else {
    break
  }
  depth++
}

console.log(path.join(__dirname,  "./bot/commands",dir))

const template =
`const { Embed } = require("../${"../".repeat(depth)}lib/classes")\r
\r
/** @param {import("../${"../".repeat(depth)}/lib/FarmBotClient.js")} bot */\r
exports.run = async (bot) => {\r
  bot.registerCommand("${name}", (message, args) => {\r
  }, bot.cooldown(${parseInt(cooldown)}))\r
}`

fs.writeFileSync(path.join(__dirname,  "./bot/commands", dir) + "/" + name + ".js", template)