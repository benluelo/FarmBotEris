import cropData from '../../data/crop-data.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';
import { Embed } from '../../lib/Embed.js';
import CONSTANTS from '../../data/CONSTANTS.js';
import { CropName } from '../../dtos/Crop.js';
import { formatMoney } from '../../utils/formatMoney.js';
import { isValidCropName } from '../../utils/isValidCropName.js';
import { getLevel } from '../../utils/level-test.js';
import { seedsPrice } from '../../utils/seedsPrice.js';

export function run(bot: FarmBotClient) {
  bot.addCommand('sell', async (message, [amount, crop, ..._args]: (string | undefined)[], userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    if (amount === undefined) {
      return message.send(new Embed().uhoh('You have to specify both an `amount` and a `crop`  to sell!'));
    }
    else if (crop !== undefined && amount !== undefined) {

      // sell the specified amount of the specified crop
      // i.e. `farm sell 2 apple`
      if (!cropData[crop as CropName]) { return message.send(new Embed().uhoh('Not a valid crop!')); }

      // TODO: only accept strings that are fully numeric
      const numAmount = parseInt(amount);
      if (numAmount.toString() !== amount) {
        return message.send(new Embed().uhoh(`**${amount}** isn't a number!`));
      }

      if ((!isValidCropName(crop) || !userdata.seeds.common[crop].discovered)) {
        return message.send(new Embed().uhoh(`Couldn't find **${crop} in your seedbag... maybe you mispelled it?`));
      }
      if (userdata.seeds.common[crop].amount >= numAmount) {

        if (bot.ENV.DEBUG === 'true') {
          console.log('Crop:', crop);
          console.log('Seed price:', seedsPrice[crop]);
          console.log('Level:', getLevel(2, userdata.seeds.common[crop].level).level);
        }
        // yes lmaoo // words are hard, i get it // fucking extremely // i give WORDS // Fucking leave this in for production lmao // (╯°□°）╯︵ ┻━┻ // YESS // i have a spell checker extenstion because  i never trust myself // LOL i saw that when you liveshared with me i was wondering what that was // HAHA
        console.log(getLevel(2, 2, userdata.seeds.common[crop].level));
        const cropValue = seedsPrice[crop] * getLevel(2, userdata.seeds.common[crop].level).level * numAmount;
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
          {
            $inc: {
              [`seeds.common.${crop}.amount`]: -numAmount,
              money: cropValue
            }
          }
        );
        message.send(new Embed().success(`Sold **${numAmount}** ${cropData[crop].emoji} for **${formatMoney(cropValue)}**!`));
      } else {
        return message.send(new Embed().uhoh(`You don't have that many ${cropData[crop]}!`));
      }
    } else {
      message.send(new Embed().uhoh('You need to use the format: `farm sell <amount> <crop>`'));
    }
  }, {
    description: 'Sell a crop in your inventory.',
    usage: '​farm sell <amount> <crop>',
    examples: 'farm sell 12 apple',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 3000
  }).subcommand('all', async (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm sell all` requires a userdata.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    const sold: Record<string, number> = Object.fromEntries(Object.keys(cropData).map((key) => { return [key, 0]; }));

    const msg = await message.send('Sellling all of your crops...');

    let totalSold = 0;
    let totalValue = 0;

    for (const seed in userdata.seeds.common) {
      if (isValidCropName(seed)) {
        if (userdata.seeds.common[seed as CropName].amount !== 0) {

          if (bot.ENV.DEBUG === 'true') {
            console.log(seed);
            console.log('Seed price:', seedsPrice[seed]);
            console.log('Level:', getLevel(2, userdata.seeds.common[seed].level).level);
          }

          const cropValue = seedsPrice[seed] * (getLevel(2, userdata.seeds.common[seed].level).level) * userdata.seeds.common[seed].amount;
          totalValue += cropValue;
          totalSold += userdata.seeds.common[seed].amount;
          sold[seed] += userdata.seeds.common[seed].amount;
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
            {
              $set: {
                [`seeds.common.${seed}.amount`]: 0,
              },
              $inc: {
                money: cropValue
              }
            }
          );
        }
      }
    }

    if (totalSold == 0) {
      msg.edit({
        content: '',
        ...new Embed().uhoh('You don\'t have any crops to sell!')
      });
    } else {
      msg.edit({
        content: '',
        ...new Embed()
          .setTitle('Sold!')
          .setDescription(
            `${Object.entries(sold)
              .filter(([_crop, amount]) => amount != 0)
              .map(([crop, amount]) => `${cropData[crop as CropName].emoji} x **${amount}**`)
              .join('\n')}\n for a total of **${formatMoney(totalValue)}!**`)
      });
    }
  }, {
    description: 'Sell all of a crop in your inventory.',
    usage: '​farm sell <amount> <crop>',
    examples: 'farm sell all apple',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    cooldown: 5000
  });
}
