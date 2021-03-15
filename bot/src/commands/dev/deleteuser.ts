import { Embed } from '../../lib/Embed.js';
import CONSTANTS from '../../data/CONSTANTS.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';

export function run(bot: FarmBotClient): void {
  bot.addCommand('deleteuser', (message) => {
    if (!message.mentions[0]) {
      // delete your own account
      const deleteUserEmbed = new Embed().uhoh(`**${message.author.username} (${message.author.id})**, account has been deleted`);

      bot.database?.Userdata.deleteOne({ userID: message.author.id });
      message.send(deleteUserEmbed);
    } else {
      // delete someones elses account
      const userToDelete = message.mentions[0];
      const deleteUserEmbed = new Embed().uhoh(`**${userToDelete.username} (${userToDelete.id})**, account has been deleted`);

      bot.database?.Userdata.deleteOne({ userID: userToDelete.id });
      message.send(deleteUserEmbed);
    }
  }, {
    description: 'Delete a user from the database.',
    usage: 'farm deleteuser [@mention]',
    // examples: false,
    permissionLevel: CONSTANTS.PERMISSIONS.DEVELOPMENT,
    category: CONSTANTS.CATEGORIES.DEVELOPMENT,
    cooldown: 0
  });
}
