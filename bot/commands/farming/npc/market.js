const { NPC } = require("../../../lib/npc.js")
const cropData = require("../../../lib/crop-data.js")
const getPriceOfSeeds = require("../../../lib/get-price-of-seeds")
const { getLevel } = require("../../../../helpers/level-test.js")

/** @param {import("../../../index.js").Bot} bot */
exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  const command = bot.registerCommand("market", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const newRequests = []

        let messageToSend

        if (userdata.requests.length < userdata.farmers.length) {
          while (userdata.requests.length + newRequests.length < userdata.farmers.length) {
          // get new requests
            const randomNPC = userdata.farmers[Math.floor(Math.random() * userdata.farmers.length)]
            newRequests.push(
              new NPC(randomNPC.name, randomNPC.gender, randomNPC.unlockableCrop, randomNPC.wealth, randomNPC.preferences)
                .newRequest(userdata.seeds.common)
            )
          }
          messageToSend = await message.send("You have new requests!")

          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
            $push: {
              requests: { $each: newRequests }
            }
          })
        }
        const marketEmbed = new bot.embed().setTitle("The Market").setColor(bot.color.market)
        const tempReq = userdata.requests.concat(newRequests)
        for (const request in tempReq) {
          const a = parseRequest(tempReq[request], userdata.farmers, request)
          marketEmbed.addField(a.farmer.emoji + " **" + a.farmer.name.match(/(\w+ [a-zA-Z])/)[0] + "." + "**", prettifyParsedRequest(a).join("\n"), true)
        }
        marketEmbed.addBlankField(true)

        if (!messageToSend) {
          message.send(marketEmbed)
        } else {
          await messageToSend.edit({
            ...marketEmbed,
            ...{ content: "You have new requests!" }
          })
        }

      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(15000))
  command.registerSubcommand("view", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          return message.send(new bot.embed().error("You have to specify an order to view!"))
        }

        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) {
          return message.send(new bot.embed().error(`**${args[0]}** is not a valid order ID!`))
        }
        const marketViewEmbed = new bot.embed()

        const a = parseRequest(userdata.requests[orderID], userdata.farmers, orderID)
        const p = prettifyParsedRequest(a)

        marketViewEmbed
          .setTitle(a.farmer.emoji + " **" + a.farmer.name + "**")
          .setDescription(p.shift())
          .setColor(bot.color.market)
          .addField(p.shift(), p.shift())
          .addField(p.shift(), p.join("\n"))
        message.send(marketViewEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  })
  command.registerSubcommand("fill", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          return message.send(new bot.embed().error("You have to specify an order to fill!"))
        }

        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) { return message.sned(new bot.embed()
          .setDescription(`**${args[0]}** is not a valid order ID!`)
          .setColor(bot.color.red)) }
        const marketFilledEmbed = new bot.embed()

        const a = parseRequest(userdata.requests[orderID], userdata.farmers, orderID)

        const enoughCrops = (() => {
          const temp = {}
          for (const req in a.want) {
            if (userdata.seeds.common[a.want[req].name].amount < a.want[req].amount) {
              return false
            } else {
              temp[`seeds.common.${a.want[req].name}.amount`] = -(a.want[req].amount)
            }
          }
          return temp
        })()

        if (!enoughCrops) {
          return new bot.embed().error("You don't have enough crops to fill this order!")
        }

        const p = prettifyParsedRequest(a)

        marketFilledEmbed
          .setTitle(a.farmer.emoji + " **" + a.farmer.name + "**")
          .setColor(bot.color.market)
          .setDescription("**Order Filled!**\n" + p.shift())
          .addField(p.shift(), p.shift())
          .addField(p.shift(), p.join("\n"))

        const farmerIndex = userdata.farmers.findIndex((f) => f.name === userdata.requests[orderID].name)

        const { value } = await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
          $pull: { ["requests"]: userdata.requests[orderID] },
          $inc: {
            money: a.rewards.money,
            [`farmers.${farmerIndex}.level`]: a.rewards.reputation,
            ...enoughCrops
          }
        }, { returnOriginal: false })

        /** @type {import("../../../lib/user.js").User} */
        const user2 = value

        const levelBefore = getLevel(2 + user2.farmers[farmerIndex].wealth, a.farmer.level).level
        const levelAfter = getLevel(2 + user2.farmers[farmerIndex].wealth, user2.farmers[farmerIndex].level).level

        if (process.env.DEBUG === "true") {
          console.log("before:", levelBefore)
          console.log("after:", levelAfter)
        }

        if (levelBefore < levelAfter) {
          marketFilledEmbed.addField("**__Friendship Increase!__**", `You've become closer friends with **${a.farmer.name}**!\n**Friendship Level** increased from **${levelBefore}** to **${levelAfter}**!`)
        }
        if (levelAfter >= userdata.farmers[farmerIndex].unlockLevel && levelBefore < userdata.farmers[farmerIndex].unlockLevel) {
          if (process.env.DEBUG === "true") { console.log(bot.database.Userdata) }
          marketFilledEmbed.addField("**__New Crop!__**", `You've become really good friends with **${a.farmer.name}**! They've decided to give you a new seed for your farm as a token of your friendship!\n**Unlocked:** ${cropData[user2.farmers[farmerIndex].unlockableCrop].emoji}`)
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
            $set: { [`seeds.common.${user2.farmers[farmerIndex].unlockableCrop}.discovered`]: true }
          })
        }
        message.sned(marketFilledEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  })

  /**
   * @param {{
      id: Number,
      want: {
        name: import("../../../lib/crop-data.js").CropName,
        emoji: import("../../../lib/crop-data.js").CropEmoji,
        amount: Number}[],
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
      `**├> ${bot.formatMoney(req.rewards.money)}`,
      `**└> **${req.rewards.reputation}** rep`
    ]
  }
}

/**
 * @param {import("../../../lib/npc.js").Request} request
 * @param {import("../../../lib/npc.js").Farmer[]} userFarmers
 * @param {(Number | String)} id
 */
function parseRequest(request, userFarmers, id) {
  const farmer = userFarmers.find((f) => {
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
      emoji: farmer.emoji,
      level: farmer.level
    }
  }
}

/**
 * Makes sense of the requests.
 * @param {Object} preferences
 * @param {import("../../../lib/farmer-data.js").tastes} preferences.taste
 * @param {import("../../../lib/farmer-data.js").colors} preferences.color
 * @param {import("../../../lib/npc.js").Request} request
 */
function parseWants(preferences, request) {
  /** @type {{val: Number, rep: Number, req: {name: import("../../../lib/crop-data.js").CropName, emoji: import("../../../lib/crop-data.js").CropEmoji, amount: Number}[]}} */
  const parsed = {
    val: 0,
    rep: 0,
    req: []
  }

  for (const w in request.want) {

    if (process.env.DEBUG === "true") { console.log(request.want[w].crop, cropData[request.want[w].crop]) }
    /** @type {0 | 0.15 | 0.30} */
    const flavourMulti = cropData[request.want[w].crop].flavour.filter((x) => x == preferences.taste).length * 0.15

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
  return req.map((r, i) => {
    return `${(i == req.length - 1) ? "└" : "├"}> ${r.emoji} x **${r.amount}**`
  }).join("\n")
}