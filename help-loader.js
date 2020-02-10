const fs = require("fs")
const rls = require("readline-sync")

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

fs.readdir("./bot/commands", async (err, files) => {
  files.forEach(async file => {
    const fSplit = file.split(".")
    if (fSplit[1] !== "js") { return }
    console.log(fSplit[0])
    let copy = template

    const descTemp = rls.question(fSplit[0] + ".description: ")
    copy.description = descTemp? descTemp: template.description

    const usageTemp = rls.question(fSplit[0] + ".usage.value: ")
    copy.usage.value = usageTemp? usageTemp: template.usage.value

    const exTemp = rls.question(fSplit[0] + ".examples.value: ")
    copy.examples.value = exTemp? exTemp: template.examples.value

    const permsTemp = rls.question(fSplit[0] + ".permissionLevel: ")
    copy.permissionLevel = permsTemp? permsTemp: template.permissionLevel

    fs.writeFileSync(`./bot/help/${fSplit[0]}.json`, JSON.stringify(copy, null, 4))
  })
})

// rl.close()