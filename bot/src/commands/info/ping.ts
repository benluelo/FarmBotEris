import CONSTANTS from '../../data/CONSTANTS.js';
import { Embed } from '../../lib/Embed.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';

export function run(bot: FarmBotClient) {
  // eslint-disable-next-line no-unused-vars
  bot.addCommand('ping', (message, _args, _userdata) => {
    const startTime = Date.now();
    const e = new Embed().success('Pinging...');
    message.send(e)
      .then((msg) => {
        msg.edit({
          ...e.setDescription('Pong! ' + (Date.now() - startTime) + 'ms.')
        });
      });
  }, {
    description: 'To view the time response from the bot to discord',
    usage: '​farm ping',
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.UTILITY,
    cooldown: 1000,
    requiresUser: false
  });
}
