import { FarmBotClient } from '../../lib/FarmBotClient.js';

import packageJson from '../../../../package.json';
import ms from 'parse-ms';
import { Embed } from '../../lib/Embed.js';
import CONSTANTS from '../../data/CONSTANTS.js';

export function run(bot: FarmBotClient): void {
  bot.addCommand('botinfo', (message) => {
    const botCreation = new Date(bot.user.createdAt).toUTCString();
    const botUptime = `${ms(bot.uptime).days}d ${ms(bot.uptime).hours}h ${ms(bot.uptime).minutes}m ${ms(bot.uptime).seconds}s`;
    const infoEmbed = new Embed()
      .setColor(bot.color.darkgreen)
      .setThumbnail(bot.user.avatarURL)
      .addField(':date: Created On:', botCreation)
      .addField(':hourglass: Uptime', botUptime)
      .addField(':rosette: Version:', packageJson.version);
    message.send(infoEmbed);
  }, {
    description: 'Show general information about the bot.',
    usage: '​farm botinfo',
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.UTILITY,
    cooldown: 3000
  });
}
