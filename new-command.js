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

console.log("Writing to:", path.join(__dirname,  "./bot/commands",dir))

const template =
`/** @private @param {import("..${"/..".repeat(depth)}/lib/FarmBotClient.js")} bot */
exports.run = async (bot) => {
  bot.addCommand("${name}", (message, args) => {
  }, {
    cooldown: ${cooldown}
  })
}`

fs.writeFileSync(path.join(__dirname,  "./bot/commands", dir) + "/" + name + ".js", template)