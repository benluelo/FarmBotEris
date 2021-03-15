import { FarmBotClient } from '../../../lib/FarmBotClient.js';
import cropData from '../../../data/crop-data.js';
import ms from 'parse-ms';
import { Embed } from '../../../lib/Embed.js';
import CONSTANTS from '../../../data/CONSTANTS.js';
import User from '../../../lib/User.js';
import { MarketRequest } from '../../../dtos/MarketRequest.js';
import { Farmer } from '../../../dtos/Farmer.js';
import { CropEmoji, CropName } from '../../../dtos/Crop.js';
import { Preferences } from '../../../lib/Npc.js';
import { formatMoney } from '../../../utils/formatMoney.js';
import { getLevel } from '../../../utils/level-test.js';
import { seedsPrice } from '../../../utils/seedsPrice.js';

const commandName = 'market';

export function run(bot: FarmBotClient): void {
  const command = bot.addCommand(commandName, async (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm market` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    const marketEmbed = new Embed()
      .setTitle('The Market')
      .setDescription(`Requests left this hour: **${userdata.requestAmount}**\nTime until new requests become available: \`${ms(userdata.requestTimeOut).hours}:${ms(userdata.requestTimeOut).minutes}.${ms(userdata.requestTimeOut).seconds}\``)
      .setColor(bot.color.market);
    const tempReq = userdata.requests;
    for (const request in tempReq) {
      console.log(request);
      const parsedRequest = parseRequest(tempReq[request], userdata.farmers, request);
      marketEmbed.addField(parsedRequest.farmer.emoji + ' **' + parsedRequest.farmer.name.match(/(\w+ [a-zA-Z])/)?.[0] || 'error' + '.' + '**', Object.values(prettifyParsedRequest(parsedRequest)).join('\n'), true);
    }
    message.send(marketEmbed);
  }, {
    description: 'Show all current market requests.',
    usage: 'farm market',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 10000
  });
  command.subcommand('view', (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    if (!args[0]) {
      return message.send(new Embed().uhoh('You have to specify an order to view!'));
    }

    const orderID = args[0].toUpperCase();
    if (!userdata.requests[orderID]) {
      return message.send(new Embed().uhoh(`**${orderID}** is not a valid order ID!`));
    }

    const parsedRequests = parseRequest(userdata.requests[orderID], userdata.farmers, orderID);
    const prettifiedParsedRequests = prettifyParsedRequest(parsedRequests);

    const marketViewEmbed = new Embed();
    marketViewEmbed
      .setTitle(parsedRequests.farmer.emoji + ' **' + parsedRequests.farmer.name + '**')
      .setDescription(prettifiedParsedRequests.id)
      .setColor(bot.color.market)
      .addField(prettifiedParsedRequests.want, prettifiedParsedRequests.requests)
      .addField(prettifiedParsedRequests.rewards, prettifiedParsedRequests.money + '\n' + prettifiedParsedRequests.reputation);
    message.send(marketViewEmbed);
  }, {
    description: 'Show a specific market request.',
    usage: 'farm market view <order id>​',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    aliases: ['info'],
    cooldown: 5000
  });
  command.subcommand('fill', async (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    if (!args[0]) {
      return message.send(new Embed().uhoh('You have to specify an order to fill!'));
    }

    const orderID = args[0].toUpperCase();
    if (!userdata.requests[orderID]) { return message.send(new Embed().uhoh(`**${orderID}** is not a valid order ID!`)); }
    const marketFilledEmbed = new Embed();

    const parsedRequest = parseRequest(userdata.requests[orderID], userdata.farmers, orderID);

    const enoughCrops = (() => {
      const temp: Record<string, number> = {};
      for (const req in parsedRequest.want) {
        if (userdata.seeds.common[parsedRequest.want[req].name].amount < parsedRequest.want[req].amount) {
          return false;
        } else {
          // not sure what's goin on here
          temp[`seeds.common.${parsedRequest.want[req].name}.amount`] = -(parsedRequest.want[req].amount);
        }
      }
      return temp;
    })();

    if (!enoughCrops) {
      return message.send(new Embed().uhoh('You don\'t have enough crops to fill this order!'));
    }

    const prettifiedParsedRequest = prettifyParsedRequest(parsedRequest);

    marketFilledEmbed
      .setTitle(parsedRequest.farmer.emoji + ' **' + parsedRequest.farmer.name + '**')
      .setColor(bot.color.market)
      .setDescription('**Order Filled!**\n' + prettifiedParsedRequest.id)
      .addField(prettifiedParsedRequest.want, prettifiedParsedRequest.requests)
      .addField(prettifiedParsedRequest.rewards, prettifiedParsedRequest.money + '\n' + prettifiedParsedRequest.reputation);

    const farmerIndex = userdata.farmers.findIndex(f => f.name === userdata.requests[orderID].name);

    const { value: user2 } = await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
      $unset: { [`requests.${orderID}`]: '' },
      $inc: {
        money: parsedRequest.rewards.money,
        [`farmers.${farmerIndex}.level`]: parsedRequest.rewards.reputation,
        ...enoughCrops
      }
    }, { returnOriginal: false });

    if (!user2) {
      return message.send('Something went wrong. Please report this in the official farmbot server.');
    }


    const levelBefore = getLevel(2 + user2.farmers[farmerIndex].wealth, parsedRequest.farmer.level).level;
    const levelAfter = getLevel(2 + user2.farmers[farmerIndex].wealth, user2.farmers[farmerIndex].level).level;

    if (bot.ENV.DEBUG === 'true') {
      console.log('before:', levelBefore);
      console.log('after:', levelAfter);
    }

    if (levelBefore < levelAfter) {
      marketFilledEmbed.addField('**__Friendship Increase!__**', `You've become closer friends with **${parsedRequest.farmer.name}**!\n**Friendship Level** increased from **${levelBefore}** to **${levelAfter}**!`);
    }
    if (levelAfter >= userdata.farmers[farmerIndex].unlockLevel && levelBefore < userdata.farmers[farmerIndex].unlockLevel) {
      if (bot.ENV.DEBUG === 'true') { console.log(bot.database.Userdata); }
      marketFilledEmbed.addField('**__New Crop!__**', `You've become really good friends with **${parsedRequest.farmer.name}**! They've decided to give you a new seed for your farm as a token of your friendship!\n**Unlocked:** ${cropData[user2.farmers[farmerIndex].unlockableCrop].emoji}`);
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
        $set: { [`seeds.common.${user2.farmers[farmerIndex].unlockableCrop}.discovered`]: true }
      });
    }
    message.send(marketFilledEmbed);
  }, {
    description: 'Fill a market request.',
    usage: 'farm market fill <order id>​',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 5000
  });
  command.subcommand('refresh', async (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    const currentRequests = Object.keys(userdata.requests);
    console.log(userdata.requestTimeOut, userdata.requestAmount, currentRequests);
    if (currentRequests.length == 9) {
      return message.send(new Embed().setDescription(`**${message.author.username}**, the market board is already full!`).setColor(bot.color.market));
    } else {
      let amountOfRequestsToGet;
      if (userdata.requestAmount == 0) {
        if ((Date.now() - userdata.requestTimeOut) >= 3600000 /* 1 hour */) {
          // reset requestTimeOut, get new requests
          const user = User.fromUserData(userdata, message.author);
          amountOfRequestsToGet = 9 - currentRequests.length;
          const newRequests: Record<string, MarketRequest> = {};

          for (let i = 0; i < amountOfRequestsToGet; ++i) {
            const { id, req } = user.newRequest(true);
            newRequests[`requests.${id}`] = req;
          }

          console.log(newRequests);

          await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
            $set: {
              requestTimeOut: Date.now(),
              requestAmount: 9,
              ...newRequests
            }
          });

        } else {
          return message.send(new Embed().setDescription(`**${message.author.username}**, you have no more requests this hour!`).setColor(bot.color.market));
        }
      } else {
        amountOfRequestsToGet = userdata.requestAmount < 9 - currentRequests.length ? userdata.requestAmount : 9 - currentRequests.length;
        const user = User.fromUserData(userdata, message.author);
        const newRequests: Record<string, MarketRequest> = {};

        for (let i = 0; i < amountOfRequestsToGet; ++i) {
          const { id, req } = user.newRequest(true);
          newRequests[`requests.${id}`] = req;
        }

        console.log(newRequests);

        await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
          $set: {
            ...newRequests
          },
          $inc: {
            requestAmount: -amountOfRequestsToGet,
          }
        });
      }

      return message.send(`**${message.author.username}**, the market board has been updated with **${amountOfRequestsToGet}** new postings!`);
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
    description: 'Refresh the market board. Every hour, you are able to refresh up to **9** orders in total.',
    usage: 'farm market refresh',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 5000
  });
  command.subcommand('remove', async (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    if (!args[0]) {
      return message.send(new Embed().uhoh('You have to specify which order you want to remove!'));
    }

    const orderID = args[0].toUpperCase();

    if (!userdata.requests[orderID]) {
      return message.send(new Embed().uhoh(`**${orderID}** is not a valid order ID!`));
    }

    await bot.database.Userdata.findOneAndUpdate({ userID: userdata.userID }, {
      $unset: {
        [`requests.${orderID}`]: ''
      }
    });

    return message.send(new Embed().setDescription(`**${message.author.username}**, succesfully deleted order \`${orderID}\`.`).setColor(bot.color.market));
  }, {
    description: 'Remove a market request.',
    usage: 'farm market remove <order id>​',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    aliases: ['delete'],
    cooldown: 5000
  });
}

/**
 * @description Prettifies the request.
 * @param req - The request to prettify.
 * @param req.id - The ID.
 * @param req.want - An array of the different wants in the request.
 * @param req.rewards - The rewards.
 * @param req.rewards.money - How much money wil be rewarded.
 * @param req.rewards.reputation - How much reputation wil be rewarded.
 * @returns The prettified request.
 */
function prettifyParsedRequest(req: {
  id: string,
  want: Req[],
  rewards: {
    money: number,
    reputation: number
  }
}) {
  return {
    id: '**__ID__: **' +
            `\`${req.id}\``,
    want: '**__Want__:**',
    requests: readableReq(req.want),
    rewards: '**__Rewards__:**',
    money: `**├> ${formatMoney(req.rewards.money)}`,
    reputation: `**└> **${req.rewards.reputation}** rep`
  };
}

/**
 * @description Parse the provided request.
 * @param request - The request object.
 * @param userFarmers - The user's farmers (their "village").
 * @param id - The ID of the request.
 * @returns The parsed request.
 */
function parseRequest(request: MarketRequest, userFarmers: Farmer[], id: string) {
  // i know its not undefined here. ideally, this function would be rewritten in such a way that
  // the assertion is unnecessary
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const farmer = userFarmers.find((f) => {
    return f.name == request.name;
  })!;

  const parsed = parseWants(farmer.preferences, request);

  return {
    id: id,
    want: parsed.requests,
    rewards: {
      money: parsed.value,
      reputation: parsed.reputation
    },
    farmer: {
      name: farmer.name,
      emoji: farmer.emoji,
      level: farmer.level
    }
  };
}

/**
 * @description Makes sense of the requests.
 * @param preferences - The farmer's preferences object.
 * @param preferences.taste - Their prefered tastes.
 * @param preferences.color - Their prefered colors.
 * @param request - The request object from the user: {@link import("../../../user.js").User}.
 * @returns An array of the different items in the request.
 */
function parseWants(preferences: Preferences, request: MarketRequest) {
  /**
     * @typedef {Object} ParsedWants
     * @prop {number} val - The monetary value of the request.
     * @prop {number} rep - The reputation(ary?) value of the request.
     * @prop {Req[]} req
     */

  const parsed = {
    value: 0,
    reputation: 0,
    requests: [] as Req[]
  };

  for (const w in request.want) {
    const flavorMultiplier = [...new Set([...cropData[request.want[w].crop].flavour, ...preferences.taste])].length * 0.15 as 0 | 0.15 | 0.30;

    const colorMultiplier = cropData[request.want[w].crop].color === preferences.color ? 0.15 : 0;

    const totalMultiplier = 1 + flavorMultiplier + colorMultiplier as 1 | 1.15 | 1.30 | 1.45;

    parsed.value += (
      (
        seedsPrice[request.want[w].crop] * request.want[w].amount * request.value
      ) * totalMultiplier
    );

    parsed.reputation += Math.ceil((request.want[w].amount * request.reputation) * totalMultiplier);

    parsed.requests.push({
      name: request.want[w].crop,
      emoji: cropData[request.want[w].crop].emoji,
      amount: request.want[w].amount
    });
  }
  return parsed;
}

/**
 * @description Makes the parsed requests readable and good for sending to the user.
 * @param req - The request.
 * @returns The readable request.
 */
function readableReq(req: Req[]): string {
  return req.map((r, i) => {
    return `${(i == req.length - 1) ? '└' : '├'}> ${r.emoji} x **${r.amount}**`;
  }).join('\n');
}

type Req = {
  name: CropName,
  emoji: CropEmoji,
  amount: number
};
