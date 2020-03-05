const { NPC } = require("../../../lib/npc.js")
const cropData = require("../../../lib/crop-data.js")
const getPriceOfSeeds = require("../../../lib/get-price-of-seeds")
const { getLevel } = require("../../../../helpers/level-test.js")

const commandName = "market"

/** @private @param {import("../../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  // eslint-disable-next-line no-unused-vars
  const command = bot.addCommand(commandName, (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        const newRequests = []

        let messageToSend

        if (userdata.requests.length < 9) {
          while (userdata.requests.length + newRequests.length < 9) {
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
        const marketEmbed = new bot.Embed().setTitle("The Market").setColor(bot.color.market)
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
            content: "",
            ...marketEmbed.setDescription("You have new requests!")
          })
        }

      } else {
        bot.startMessage(message)
      }
    })
  })
  command.subcommand("view", (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          return message.send(new bot.Embed().uhoh("You have to specify an order to view!"))
        }

        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) {
          return message.send(new bot.Embed().uhoh(`**${args[0]}** is not a valid order ID!`))
        }
        const marketViewEmbed = new bot.Embed()

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
  command.subcommand("fill", (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) {
          return message.send(new bot.Embed().uhoh("You have to specify an order to fill!"))
        }

        const orderID = parseInt(args[0]) - 1
        if (((orderID + 1).toString() != args[0]) || !userdata.requests[orderID]) { return message.send(new bot.Embed().uhoh(`**${args[0]}** is not a valid order ID!`)) }
        const marketFilledEmbed = new bot.Embed()

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
          return message.send(new bot.Embed().uhoh("You don't have enough crops to fill this order!"))
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
        message.send(marketFilledEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  })

  /**
   * @description Prettify the request.
   * @param {Object} req - The request to prettify.
   * @param {Number} req.id - The ID.
   * @param {Req[]} req.want - An array of the different wants in the request.
   * @param {Object} req.rewards - The rewards.
   * @param {Number} req.rewards.money - How much money wil be rewarded.
   * @param {Number} req.rewards.amount - How much reputation wil be rewarded.
   * @returns {String} The prettified request.
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
 * @description Parse the provided request.
 * @param {import("../../../lib/npc.js").Request} request - The request object.
 * @param {import("../../../lib/npc.js").Farmer[]} userFarmers - The user's farmers (their "village").
 * @param {(Number | String)} id - The ID of the request.
 * @returns The parsed request.
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
 * @description Makes sense of the requests.
 * @param {Object} preferences - The farmer's preferences object.
 * @param {import("../../../lib/farmer-data.js").tastes} preferences.taste - Their prefered tastes.
 * @param {import("../../../lib/farmer-data.js").colors} preferences.color - Their prefered colors.
 * @param {import("../../../lib/npc.js").Request} request - The request object from the user: {@link import("../../../user.js").User}.
 * @returns {ParsedWants} An array of the different items in the request.
 */
function parseWants(preferences, request) {
  /**
   * @typedef {Object} ParsedWants
   * @prop {Number} val - The monetary value of the request.
   * @prop {Number} rep - The reputation(ary?) value of the request.
   * @prop {Req[]} req
   */
  /** @type {ParsedWants} */
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
 * @description Makes the parsed requests readable and good for sending to the user.
 * @param {Req} req - The request.
 * @returns {String} The reqdable request.
 */
function readableReq(req) {
  return req.map((r, i) => {
    return `${(i == req.length - 1) ? "└" : "├"}> ${r.emoji} x **${r.amount}**`
  }).join("\n")
}

/**
 * @typedef {Object} Req
 * @prop {import("../../../lib/crop-data.js").CropName} name - The name.
 * @prop {import("../../../lib/crop-data.js").CropEmoji} emoji - The emoji.
 * @prop {Number} amount - The amount.
 */