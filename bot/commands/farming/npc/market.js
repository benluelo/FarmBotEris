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
          const a = parseRequest(tempReq[request], userdata.farmers, request)
          marketEmbed.addField(a.farmer.emoji + " **" + a.farmer.name.match(/(\w+ [a-zA-Z])/)[0] + "." + "**", prettifyParsedRequest(a).join("\n"), true)
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
        if (!args[0]) { return bot.createMessage(message.channel.id, "You have to specify an order to view!") }
        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) { return bot.createMessage(message.channel.id, `**${args[0]}** is not a valid order ID!`) }
        const marketViewEmbed = new Embed()

        const a = parseRequest(userdata.requests[orderID], userdata.farmers, orderID)
        const p = prettifyParsedRequest(a)

        marketViewEmbed
          .setTitle(a.farmer.emoji + " **" + a.farmer.name + "**")
          .setDescription(p.shift())
          .addField(p.shift(), p.shift())
          .addField(p.shift(), p.join("\n"))
        bot.createMessage(message.channel.id, marketViewEmbed)
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

        const a = parseRequest(userdata.requests[orderID], userdata.farmers, orderID)
        const p = prettifyParsedRequest(a)

        marketFilledEmbed
          .setTitle(a.farmer.emoji + " **" + a.farmer.name + "**")
          .setDescription(p.shift())
          .addField(p.shift(), p.shift())
          .addField(p.shift(), p.join("\n"))
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
          $pull: { ["requests"]: userdata.requests[orderID] },
          $inc: {
            "money": a.rewards.money,
            [`farmers.${userdata.farmers.findIndex(npc => npc.name === userdata.requests[orderID].name)}.level`]: a.rewards.reputation }
        })
        bot.createMessage(message.channel.id, marketFilledEmbed)
      }
    })
  })

  /**
   * @param {{
      id: Number,
      want: {name: String, emoji: String, amount: Number}[],
      rewards: {
        money: Number,
        reputation: Number
      }
    }} req
   */
  function prettifyParsedRequest(req) {
    return [
      "**__ID__: **" +
      `\`${parseInt(req.id)}\``,
      "**__Want__:**",
      readableReq(req.want),
      "**__Rewards__:**",
      `**├⮞ ${bot.formatMoney(req.rewards.money)} ${emoji.coin}`,
      `**└⮞ **${req.rewards.reputation}** rep`
    ]
  }
}

/**
 * @param {import("../../../lib/npc.js").Request} request
 * @param {import("../../../lib/npc.js").Farmer[]} userFarmers
 * @param {(Number | String)} id
 */
function parseRequest(request, userFarmers, id) {
  const farmer = userFarmers.find(f => {
    return f.name == request.name
  })

  const parsed = parseWants(farmer.preferences, request)

  return {
    id: parseInt(id) + 1,
    want: parsed.req,
    rewards: {
      money: parsed.val,
      reputation: parsed.rep
    },
    farmer: {
      name: farmer.name,
      emoji: farmer.emoji
    }
  }
}

/**
 * Makes sense of the requests.
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
  /** @type {{val: Number, rep: Number, req: {name: String, emoji: String, amount: Number}[]}} */
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

    parsed.val += (
      (
        getPriceOfSeeds[request.want[w].crop] * request.want[w].amount * request.value
      ) * totalMulti
    )

    parsed.rep += Math.ceil(
      (
        request.want[w].amount * request.reputation
      ) * totalMulti
    )

    parsed.req.push({
      name: request.want[w].crop,
      emoji: cropData[request.want[w].crop].emoji,
      amount: request.want[w].amount
    })
  }
  return parsed
}

/**
 * @param {{name: String, emoji: String, amount: Number}[]} req
 */
function readableReq(req) {
  return req.map(r => {
    return `${r.emoji} x **${r.amount}**`
  }).join("\n")
}