const smallNumbers = require("../../lib/smallNumbers.json")
const cropEmoji = require("../../lib/crop-emoji.json")
const { Embed } = require("../../lib/classes")

const getSmallNumbers = (number) => {
  number = number.toString()
  let numberString = ""
  for (let i = 0; i < number.length; i++) {
    numberString += smallNumbers[number[i]]
  }
  return numberString
}

exports.run = (bot) => {
  bot.registerCommand("inventory", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log.error(err)

      // gather inv
      let invItemList = {}
      let invItemString = ""
      let inter = 0
      const gap = "  "
      for (let plant in userdata.seeds.common) {
        if (userdata.seeds.common[plant].amount !== 0) {
          invItemList[cropEmoji[plant]] = userdata.seeds.common[plant].amount
        }
      }

      if (invItemList.length == 0) invItemString = "When you harvest your crops, they'll show up here!"

      // sort the numbers
      let sortable = []
      for (let item in invItemList) {
        sortable.push([item, invItemList[item]])
      }
      sortable.sort(function(a, b) {
        return a[1] - b[1]
      })

      for (let i = sortable.length-1; i >= 0 ; i--) {
        invItemString += `${sortable[i][0]}${getSmallNumbers(sortable[i][1])}${gap}`
        if (inter === 5) { invItemString += "\n"; inter = 0 } else {inter+=1}
      }

      // make embed
      const invEmbed = new Embed()
        .setAuthor(`${message.author.username}'s Inventory`, message.author.avatarURL)
        .setColor(bot.color.lightgreen)
        .setDescription(invItemString)

      bot.createMessage(message.channel.id, invEmbed.show())
    })
  })
  bot.registerCommandAlias("inv", "inventory")
}