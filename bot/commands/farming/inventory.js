const smallNumbers = require("../../lib/small-numbers.json")
const cropData = require("../../lib/crop-data.js")

const getSmallNumbers = (number) => {
  number = number.toString()
  let numberString = ""
  for (let i = 0; i < number.length; i++) {
    numberString += smallNumbers[number[i]]
  }
  return numberString
}

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("inventory", (message, _args, userdata) => {
    // gather inv
    const invItemList = {}
    let invItemString = ""
    let inter = 0
    const gap = "  "
    for (const plant in userdata.seeds.common) {
      if (0 !== userdata.seeds.common[plant].amount) {
        invItemList[cropData[plant].emoji] = userdata.seeds.common[plant].amount
      }
    }

    // check if user has anything in their inventory
    if (Object.keys(invItemList) == 0) {
      invItemString = "When you harvest your crops, they'll show up here!"
    } else {
      // sort the numbers to order them highest to lowest
      const sortable = []
      for (const item in invItemList) {
        sortable.push([item, invItemList[item]])
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1]
      })
      for (let i = sortable.length - 1; 0 <= i ; i--) {
        invItemString += `${sortable[i][0]}${getSmallNumbers(sortable[i][1])}${gap}`
        if (inter === 5) { invItemString += "\n"; inter = 0 } else { inter += 1 }
      }
    }

    message.send(new bot.Embed()
      .setAuthor(`${message.author.username}'s Inventory`, null,  message.author.avatarURL)
      .setColor(bot.color.lightgreen)
      .setDescription(invItemString))
  }, {
    description: "Shows all the items in your inventory",
    usage: "​farm inventory",
    examples: false,
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["inv"],
    cooldown: 3000
  })
}