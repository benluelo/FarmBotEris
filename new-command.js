const { question } = require("readline-sync")
const fs = require("fs")
const path = require("path")

const name = question("file name? ")
const cooldown = question("cooldown length? ")

let dir = ""
let depth = 1
for (;;) {
  const temp = question(`directory to write to? (commands/${dir}): `)
  console.log(temp)
  if (!temp.trim() == "") {
    dir += "/" + temp
  } else {
    break
  }
}

console.log(path.join(__dirname,  "./bot/commands",dir))

const template =
`const { Embed } = require("../${"../".repeat(depth)}lib/classes")\r
\r
/** @param {import("../${"../".repeat(depth)}index.js").Bot} bot */\r
exports.run = async (bot) => {\r
  bot.registerCommand("${name}", (message) => {\r
  }, bot.cooldown(${parseInt(cooldown)}))\r
}`

fs.writeFileSync(path.join(__dirname,  "./bot/commands", dir) + "/" + name + ".js", template)