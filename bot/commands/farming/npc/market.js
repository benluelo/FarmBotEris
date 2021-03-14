const { UserData } = require("../../../lib/user.js")
const cropData = require("../../../lib/crop-data.js")
const getPriceOfSeeds = require("../../../lib/get-price-of-seeds")
const { getLevel } = require("../../../../helpers/level-test.js")
const ms = require("parse-ms")

const commandName = "market"

/** @private @param {import("../../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  const command = bot.addCommand(commandName, async (message, _args, userdata) => {
    const marketEmbed = new bot.Embed()
      .setTitle("The Market")
      .setDescription(`Requests left this hour: **${userdata.requestAmount}**\nTime until new requests become available: \`${ms(userdata.requestTimeOut).hours}:${ms(userdata.requestTimeOut).minutes}.${ms(userdata.requestTimeOut).seconds}\``)
      .setColor(bot.color.market)
    const tempReq = userdata.requests
    for (const request in tempReq) {
      console.log(request)
      const a = parseRequest(tempReq[request], userdata.farmers, request)
      marketEmbed.addField(a.farmer.emoji + " **" + a.farmer.name.match(/(\w+ [a-zA-Z])/)[0] + "." + "**", prettifyParsedRequest(a).join("\n"), true)
    }
    message.send(marketEmbed)
  }, {
    description: "Show all current market requests.",
    usage: "farm market",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 10000
  })
  command.subcommand("view", (message, args, userdata) => {
    if (!args[0]) {
      return message.send(new bot.Embed().uhoh("You have to specify an order to view!"))
    }

    const orderID = args[0].toUpperCase()
    if (!userdata.requests[orderID]) {
      return message.send(new bot.Embed().uhoh(`**${orderID}** is not a valid order ID!`))
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
  }, {
    description: "Show a specific market request.",
    usage: "farm market view <order id>​",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["info"],
    cooldown: 5000
  })
  command.subcommand("fill", async (message, args, userdata) => {
    if (!args[0]) {
      return message.send(new bot.Embed().uhoh("You have to specify an order to fill!"))
    }

    const orderID = args[0].toUpperCase()
    if (!userdata.requests[orderID]) { return message.send(new bot.Embed().uhoh(`**${orderID}** is not a valid order ID!`)) }
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
      $unset: { [`requests.${orderID}`]: "" },
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

    if (bot.ENV.DEBUG === "true") {
      console.log("before:", levelBefore)
      console.log("after:", levelAfter)
    }

    if (levelBefore < levelAfter) {
      marketFilledEmbed.addField("**__Friendship Increase!__**", `You've become closer friends with **${a.farmer.name}**!\n**Friendship Level** increased from **${levelBefore}** to **${levelAfter}**!`)
    }
    if (levelAfter >= userdata.farmers[farmerIndex].unlockLevel && levelBefore < userdata.farmers[farmerIndex].unlockLevel) {
      if (bot.ENV.DEBUG === "true") { console.log(bot.database.Userdata) }
      marketFilledEmbed.addField("**__New Crop!__**", `You've become really good friends with **${a.farmer.name}**! They've decided to give you a new seed for your farm as a token of your friendship!\n**Unlocked:** ${cropData[user2.farmers[farmerIndex].unlockableCrop].emoji}`)
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
        $set: { [`seeds.common.${user2.farmers[farmerIndex].unlockableCrop}.discovered`]: true }
      })
    }
    message.send(marketFilledEmbed)
  }, {
    description: "Fill a market request.",
    usage: "farm market fill <order id>​",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  })
  command.subcommand("refresh", async (message, _args, userdata) => {
    const currentRequests = Object.keys(userdata.requests)
    console.log(userdata.requestTimeOut, userdata.requestAmount, currentRequests)
    if (currentRequests.length == 9) {
      return message.send(new bot.Embed().setDescription(`**${message.author.username}**, the market board is already full!`).setColor(bot.color.market))
    } else {
      let amountOfRequestsToGet
      if (userdata.requestAmount == 0) {
        if ((Date.now() - userdata.requestTimeOut) >= 3600000 /* 1 hour */) {
          // reset requestTimeOut, get new requests
          const user = new UserData(message.author, userdata)
          amountOfRequestsToGet = 9 - currentRequests.length
          const newRequests = {}

          for (let i = 0; i < amountOfRequestsToGet; ++i) {
            const { id, req } = user.newRequest(true)
            newRequests[`requests.${id}`] = req
          }

          console.log(newRequests)

          await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
            $set: {
              requestTimeOut: Date.now(),
              requestAmount: 9,
              ...newRequests
            }
          })

        } else {
          return message.send(new bot.Embed().setDescription(`**${message.author.username}**, you have no more requests this hour!`).setColor(bot.colors.market))
        }
      } else {
        amountOfRequestsToGet = userdata.requestAmount < 9 - currentRequests.length ? userdata.requestAmount : 9 - currentRequests.length
        const user = new UserData(message.author, userdata)
        const newRequests = {}

        for (let i = 0; i < amountOfRequestsToGet; ++i) {
          const { id, req } = user.newRequest(true)
          newRequests[`requests.${id}`] = req
        }

        console.log(newRequests)

        await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
          $set: {
            ...newRequests
          },
          $inc: {
            requestAmount: -amountOfRequestsToGet,
          }
        })
      }

      return message.send(`**${message.author.username}**, the market board has been updated with **${amountOfRequestsToGet}** new postings!`)
    }
    // const newRequests = {}

    // let messageToSend

    // if (userdata.requests.length < 9) {
    //   while (userdata.requests.length + newRequests.length < 9) {
    //     // get new requests
    //     const randomNPC = userdata.farmers[Math.floor(Math.random() * userdata.farmers.length)]
    //     newRequests.push(
    //       new NPC(randomNPC.name, randomNPC.gender, randomNPC.unlockableCrop, randomNPC.wealth, randomNPC.preferences)
    //         .newRequest(userdata.seeds.common)
    //     )
    //   }
    //   messageToSend = await message.send("You have new requests!")

    //   await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
    //     $push: {
    //       requests: { $each: newRequests }
    //     }
    //   })
    // }
  }, {
    description: "Refresh the market board. Every hour, you are able to refresh up to **9** orders in total.",
    usage: "farm market refresh",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    cooldown: 5000
  })
  command.subcommand("remove", async (message, args, userdata) => {
    const orderID = args[0].toUpperCase()
    if (!orderID) {
      return message.send(new bot.Embed().uhoh("You have to specify which order you want to remove!"))
    }
    if (!userdata.requests[orderID]) {
      return message.send(new bot.Embed().uhoh(`**${orderID}** is not a valid order ID!`))
    }

    await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
      $unset: {
        [`requests.${orderID}`]: ""
      }
    })

    return message.send(new bot.Embed().setDescription(`**${message.author.username}**, succesfully deleted order \`${orderID}\`.`).setColor(bot.colors.market))
  }, {
    description: "Remove a market request.",
    usage: "farm market remove <order id>​",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    aliases: ["delete"],
    cooldown: 5000
  })

  /**
   * @description Prettify the request.
   * @param {Object} req - The request to prettify.
   * @param {string} req.id - The ID.
   * @param {Req[]} req.want - An array of the different wants in the request.
   * @param {Object} req.rewards - The rewards.
   * @param {number} req.rewards.money - How much money wil be rewarded.
   * @param {number} req.rewards.amount - How much reputation wil be rewarded.
   * @returns {string} The prettified request.
   */
  function prettifyParsedRequest(req) {
    return [
      "**__ID__: **" +
      `\`${req.id}\``,
      "**__Want__:**",
      readableReq(req.want),
      "**__Rewards__:**",
      `**├> ${bot.formatMoney(req.rewards.money)}`,
      `**└> **${req.rewards.reputation}** rep`
    ]
  }

  /**
   * @description Parse the provided request.
   * @param {import("../../../lib/npc.js").Request} request - The request object.
   * @param {import("../../../lib/npc.js").Farmer[]} userFarmers - The user's farmers (their "village").
   * @param {(number | string)} id - The ID of the request.
   * @returns The parsed request.
   */
  function parseRequest(request, userFarmers, id) {
    const farmer = userFarmers.find((f) => {
      return f.name == request.name
    })

    const parsed = parseWants(farmer.preferences, request)

    return {
      id:id,
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
     * @prop {number} val - The monetary value of the request.
     * @prop {number} rep - The reputation(ary?) value of the request.
     * @prop {Req[]} req
     */
    /** @type {ParsedWants} */
    const parsed = {
      val: 0,
      rep: 0,
      req: []
    }

    for (const w in request.want) {

      if (bot.ENV.DEBUG === "true") { console.log(request.want[w].crop, cropData[request.want[w].crop]) }
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
   * @returns {string} The reqdable request.
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
   * @prop {number} amount - The amount.
   */
}