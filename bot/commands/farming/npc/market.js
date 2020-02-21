const { Embed } = require("../../../lib/classes")
const { NPC } = require("../../../lib/npc.js")

exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("market", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }

      if (!userdata) {
        bot.startMessage(message)
      }

      if (userdata) {
        console.log(userdata.requests)
        if (userdata.requests.length < userdata.farmers.length) {
          const newRequests = []
          while (userdata.requests.length + newRequests.length < userdata.farmers.length) {
          // get new requests
            const randomNPC = userdata.farmers[Math.floor(Math.random() * userdata.farmers.length)]
            newRequests.push(new NPC(randomNPC.name, randomNPC.gender, randomNPC.wealth, randomNPC.preferences)
              .newRequest(userdata.seeds.common))
          }
          bot.createMessage(message.channel.id, "YOUR REQUESTS SIRE")

          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
            $push: {
              requests: { $each: newRequests }
            }
          })
        }
      }
    })
    // eslint-disable-next-line no-unused-vars
    const marketEmbed = new Embed()
  }, bot.cooldown(15000))
}