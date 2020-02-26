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

/** @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.registerCommand("inventory", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
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
            if (5 === inter) { invItemString += "\n"; inter = 0 } else { inter += 1 }
          }
        }

        // make embed
        const invEmbed = new bot.embed()
          .setAuthor(`${message.author.username}'s Inventory`, null,  message.author.avatarURL)
          .setColor(bot.color.lightgreen)
          .setDescription(invItemString)

        message.send(invEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(3000))
  bot.registerCommandAlias("inv", "inventory")
}