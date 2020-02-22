const fs = require("fs")
const path = require("path")
const { question } = require("readline-sync")

const template = {
  description: null,
  usage: {
    name: "Usage:",
    value: "\u200B"
  },
  examples: {
    name: "Examples:",
    value: "\u200B"
  },
  permissionLevel: 0
}

console.log(path.resolve(__dirname, "../bot/commands"))

;(function getFiles(dir, depth = 0) {
  fs.readdir(dir, async (err, files) => {
    if (err) { console.log(err) }
    files.forEach(file => {
      if (fs.lstatSync(`${dir}/${file}`).isDirectory()) {
        getFiles(`${dir}/${file}`, depth + 1)
      }
      const fSplit = file.split(".")
      if ("js" !== fSplit[1]) { return }
      console.log(fSplit[0])
      const copy = template

      const descTemp = question(fSplit[0] + ".description: ")
      copy.description = descTemp ? descTemp : template.description

      const usageTemp = question(fSplit[0] + ".usage.value: ")
      copy.usage.value = usageTemp ? usageTemp : template.usage.value

      const exTemp = question(fSplit[0] + ".examples.value: ")
      copy.examples.value = exTemp ? exTemp : template.examples.value

      const permsTemp = question(fSplit[0] + ".permissionLevel: ")
      copy.permissionLevel = permsTemp ? permsTemp : template.permissionLevel

      // console.log(path.resolve(__dirname, "../".repeat(depth), `./bot/help/${fSplit[0]}.json`))

      fs.writeFileSync(`./bot/help/${fSplit[0]}.json`, JSON.stringify(copy, null, 4))
    })
  })
})(path.resolve(__dirname, "../bot/commands/"))

// rl.close()