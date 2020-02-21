const { Embed } = require("../../../lib/classes")
const { NPC } = require("../../../lib/npc.js")
const cropData = require("../../../lib/crop-data.js")
const getPriceOfSeeds = require("../../../lib/get-price-of-seeds")
const emoji = require("../../../lib/emoji.json")

exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  const command = bot.registerCommand("market", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }

      if (!userdata) {
        bot.startMessage(message)
      }

      if (userdata) {
        // console.log(userdata.requests)
        const newRequests = []
        if (userdata.requests.length < userdata.farmers.length) {
          while (userdata.requests.length + newRequests.length < userdata.farmers.length) {
          // get new requests
            const randomNPC = userdata.farmers[Math.floor(Math.random() * userdata.farmers.length)]
            newRequests.push(
              new NPC(randomNPC.name, randomNPC.gender, randomNPC.wealth, randomNPC.preferences)
                .newRequest(userdata.seeds.common)
            )
          }
          bot.createMessage(message.channel.id, "You have new requests!")

          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
            $push: {
              requests: { $each: newRequests }
            }
          })
        }
        const marketEmbed = new Embed().setTitle("The Market").setColor(bot.color.darkgreen)
        const tempReq = userdata.requests.concat(newRequests)
        for (const request in tempReq) {
          console.log(tempReq[request])
          const farmer = userdata.farmers.find(npc => {
            return npc.name == tempReq[request].name
          })
          console.log(farmer)
          let msg = `**__ID__: **\`${parseInt(request) + 1}\`\n`
          let value = 0
          let rep = 0
          msg += "**__Want__:**\n"
          for (const w in tempReq[request].want) {
            /** @type {1 | 1.15 | 1.30} */
            const flavourMulti = 1 + (cropData[tempReq[request].want[w].crop].flavour.filter(x => x == farmer.preferences).length * 0.15)
            const colorMulti = cropData[tempReq[request].want[w].crop].color == farmer.preferences ? 1.15 : 1
            value += (
              (getPriceOfSeeds[tempReq[request].want[w].crop] // hourly price of the seed
               * tempReq[request].want[w].amount // the amount in the request
               * tempReq[request].value) // the multiplier of the request (value)
             * flavourMulti // fruit is favourite flavor? add corresponding value
             * colorMulti) // fruit is favourite color? add 15% value

            rep += (
              (tempReq[request].want[w].amount // the amount in the request
               * tempReq[request].reputation) // the multiplier of the request (reputation)
             * flavourMulti // fruit is favourite flavor? add corresponding value
             * colorMulti) // fruit is favourite color? add 15% value
            msg += cropData[tempReq[request].want[w].crop].emoji + " x " + tempReq[request].want[w].amount + "\n"
          }
          msg += "**__Rewards__:**\n"
          + "**├⮞   " + bot.formatMoney(value) + "** " + emoji.coin + "\n"
          + "**└⮞   " + Math.ceil(rep) + "** rep"
          marketEmbed.addField(farmer.emoji + " **" + farmer.name.match(/(\w+ [a-zA-Z])/)[0] + "." + "**", msg, true)
        }
        bot.createMessage(message.channel.id, marketEmbed.addBlankField(true))
      }
    })
  }, bot.cooldown(15000))
  command.registerSubcommand("view", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }

      if (!userdata) {
        bot.startMessage(message)
      }

      if (userdata) {
        if (!args[0]) { return bot.createMessage(message.channel.id, "You have to specify an order to fill!") }
        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) { return bot.createMessage(message.channel.id, `**${args[0]}** is not a valid order ID!`) }
        const marketFilledEmbed = new Embed()

        const farmer = userdata.farmers.find(npc => npc.name === userdata.requests[orderID].name)
        let msg = `**__ID__: **\`${orderID + 1}\`\n`
        let value = 0
        let rep = 0
        msg += "**__Want__:**\n"
        for (const w in userdata.requests[orderID].want) {
          /** @type {1 | 1.15 | 1.30} */
          const flavourMulti = 1 + (cropData[userdata.requests[orderID].want[w].crop].flavour.filter(x => x == farmer.preferences).length * 0.15)
          const colorMulti = cropData[userdata.requests[orderID].want[w].crop].color == farmer.preferences ? 1.15 : 1
          value += (
            (getPriceOfSeeds[userdata.requests[orderID].want[w].crop] // hourly price of the seed
             * userdata.requests[orderID].want[w].amount // the amount in the request
             * userdata.requests[orderID].value) // the multiplier of the request (value)
           * flavourMulti // fruit is favourite flavor? add corresponding value
           * colorMulti) // fruit is favourite color? add 15% value

          rep += (
            (userdata.requests[orderID].want[w].amount // the amount in the request
             * userdata.requests[orderID].reputation) // the multiplier of the request (reputation)
           * flavourMulti // fruit is favourite flavor? add corresponding value
           * colorMulti) // fruit is favourite color? add 15% value
          msg += cropData[userdata.requests[orderID].want[w].crop].emoji + " x " + userdata.requests[orderID].want[w].amount + "\n"
        }
        msg += "**__Rewards__:**\n"
        + "**├⮞   " + bot.formatMoney(value) + "** " + emoji.coin + "\n"
        + "**└⮞   " + Math.ceil(rep) + "** rep"
        marketFilledEmbed.setTitle(farmer.emoji + " **" + farmer.name + "**").setDescription(msg)
        bot.createMessage(message.channel.id, marketFilledEmbed)
      }
    })
  })
  command.registerSubcommand("fill", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { throw err }

      if (!userdata) {
        bot.startMessage(message)
      }

      if (userdata) {
        if (!args[0]) { return bot.createMessage(message.channel.id, "You have to specify an order to fill!") }
        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) { return bot.createMessage(message.channel.id, `**${args[0]}** is not a valid order ID!`) }
        const marketFilledEmbed = new Embed()

        const farmer = userdata.farmers.find(npc => npc.name === userdata.requests[orderID].name)
        let msg = `**__ID__: **\`${orderID + 1}\`\n`
        let value = 0
        let rep = 0
        msg += "**__Want__:**\n"
        for (const w in userdata.requests[orderID].want) {
          /** @type {1 | 1.15 | 1.30} */
          const flavourMulti = 1 + (cropData[userdata.requests[orderID].want[w].crop].flavour.filter(x => x == farmer.preferences).length * 0.15)
          const colorMulti = cropData[userdata.requests[orderID].want[w].crop].color == farmer.preferences ? 1.15 : 1
          value += (
            (getPriceOfSeeds[userdata.requests[orderID].want[w].crop] // hourly price of the seed
             * userdata.requests[orderID].want[w].amount // the amount in the request
             * userdata.requests[orderID].value) // the multiplier of the request (value)
           * flavourMulti // fruit is favourite flavor? add corresponding value
           * colorMulti) // fruit is favourite color? add 15% value

          rep += (
            (userdata.requests[orderID].want[w].amount // the amount in the request
             * userdata.requests[orderID].reputation) // the multiplier of the request (reputation)
           * flavourMulti // fruit is favourite flavor? add corresponding value
           * colorMulti) // fruit is favourite color? add 15% value
          msg += cropData[userdata.requests[orderID].want[w].crop].emoji + " x " + userdata.requests[orderID].want[w].amount + "\n"
        }
        msg += "**__Rewards__:**\n"
        + "**├⮞   " + bot.formatMoney(value) + "** " + emoji.coin + "\n"
        + "**└⮞   " + Math.ceil(rep) + "** rep"

        bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
          $pull: { ["requests"]: userdata.requests[orderID] },
          $inc: { "money": value, [`farmers.${userdata.farmers.findIndex(npc => npc.name === userdata.requests[orderID].name)}.level`]: Math.ceil(rep) }
        })
        marketFilledEmbed.setTitle(farmer.emoji + " **" + farmer.name + "**").setDescription(msg)
        bot.createMessage(message.channel.id, marketFilledEmbed)
      }
    })
  })
}

/**
 *
 * @param {Object} request
 * @param {Object[]} request.want
 * @param {String} request.want[].crop
 * @param {Number} request.want[].amount
 * @param {Number} request.value
 * @param {Number} request.reputation
 * @param {Object} preferences
 * @param {import("../../../lib/farmer-data.js").tastes} preferences.taste
 * @param {import("../../../lib/farmer-data.js").colors} preferences.color
 */
function parseWants(preferences, request) {
  /**
   * @type {{val: Number, rep: Number, req: {emoji: String, amount: Number}[]}}}
   */
  const parsed = {
    val: 0,
    rep: 0,
    req: []
  }
  for (const w in request.want) {
    /** @type {0 | 0.15 | 0.30} */
    const flavourMulti = (cropData[request.want[w].crop].flavour.filter(x => x == preferences.taste).length * 0.15)

    /** @type {0 | 0.15} */
    const colorMulti = cropData[request.want[w].crop].color == preferences.color ? 0.15 : 0

    /** @type {1 | 1.15 | 1.30 | 1.45} */
    const totalMulti = 1 + flavourMulti + colorMulti

    parsed.val +=
    (
      (
        getPriceOfSeeds[request.want[w].crop] * request.want[w].amount * request.value
      ) * totalMulti
    )

    parsed.rep +=
    (
      (
        request.want[w].amount * request.reputation
      ) * totalMulti
    )
    parsed.req.push({
      emoji: cropData[request.want[w].crop].emoji,
      amount: request.want[w].amount
    })
  }

  return parsed
}