import smallNumbers from '../../json/small-numbers.json';
import cropData from '../../data/crop-data.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';
import type { CropName } from '../../dtos/Crop.js';
import { Embed } from '../../lib/Embed.js';
import CONSTANTS from '../../data/CONSTANTS.js';

const getSmallNumbers = (number: number) => {
  const numberString = number.toString();
  let smallNumberString = '';
  for (let i = 0; i < smallNumberString.length; i++) {
    smallNumberString += smallNumbers[parseInt(numberString[i])];
  }
  return numberString;
};

export function run(bot: FarmBotClient): void {
  bot.addCommand('inventory', (message, _args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm inventory` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    // gather inv
    const invItemList: Record<string, number> = {};
    let invItemString = '';
    const gap = '  ';
    for (const plant in userdata.seeds.common) {
      if (0 !== userdata.seeds.common[plant as CropName].amount) {
        const temp = cropData[plant as CropName];
        invItemList[temp.emoji] = userdata.seeds.common[plant as CropName].amount;
      }
    }

    // check if user has anything in their inventory
    if (Object.keys(invItemList).length === 0) {
      invItemString = 'When you harvest your crops, they\'ll show up here!';
    } else {
      Object.entries(invItemList)
        .sort(([, a], [, b]) => a - b)
        .map(([crop, amount]) => `${crop}${getSmallNumbers(amount)}`)
        .join(gap);
    }

    message.send(new Embed()
      .setAuthor(`${message.author.username}'s Inventory`, undefined, message.author.avatarURL)
      .setColor(bot.color.lightgreen)
      .setDescription(invItemString));
  }, {
    description: 'Shows all the items in your inventory',
    usage: '​farm inventory',
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    aliases: ['inv'],
    cooldown: 3000
  });
}
