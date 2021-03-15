import EmbedPaginator from 'eris-pagination';
import { isValidCountry } from '../../utils/isValidCountry.js';
import CONSTANTS from '../../data/CONSTANTS.js';
import { Embed } from '../../lib/Embed.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';
import flags from '../../json/flags.json';
import User from '../../lib/User.js';
import Log from '../../logger.js';
import { getFarmers } from '../../utils/getFarmers.js';
import { UserData } from '../../dtos/UserData.js';

export function run(bot: FarmBotClient) {
  bot.addCommand('start', (message, args) => {
    bot.getUser(message.author.id, async (err, userdata) => {
      if (userdata === null) {
        throw new Error('command `farm start` requires a user data.');
      }
      if (bot.database === undefined) {
        return message.send('Database not yet initialized. Please try again in a moment.');
      }

      // const country = args.join(" ").toLowerCase()
      if (err) { Log.error(err); }

      if (!userdata) {

        if (!args[0]) {

          const myEmbeds = [];

          let count = 0;
          let embed = new Embed().setTitle('Send `farm start <region>` to start farming!');
          for (const [flagRegion, flag] of Object.entries(flags)) {
            count++;
            embed.addField(flagRegion.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '), flag, true);

            if (count === 12) {
              count = 0;
              myEmbeds.push(embed.showContent());
              embed = new Embed().setTitle('Send `farm start <region>` to start farming!');
            }
          }

          if (0 !== count) {
            myEmbeds.push(embed.showContent());
          }

          return await EmbedPaginator.createPaginationEmbed(message, myEmbeds);
        } else {
          const region = args.join(' ').toLowerCase();
          if (isValidCountry(region)) {
            const farmers = getFarmers(region);
            if (farmers === undefined) {
              return message.send('Something went wrong. please report this in the official Farmbot server.');
            }
            const newUser = new User(message.author, region, farmers);
            for (let i = 0; i < 9; ++i) {
              newUser.newRequest(false);
            }
            bot.database.Userdata.insertOne(newUser as UserData);
            message.send(new Embed()
              .setTitle(`Welcome to ${bot.user.username}, ${message.author.username}!  ${flags[region]}`)
              .setDescription('Do `farm help` to display the full list of commands the bot has!')
              .setColor(bot.color.lightgreen)
            );
          } else {
            return message.send(new Embed().uhoh(`Couldn't find **"${region}"** anywhere on a map... maybe try somewhere else?`));
          }
        }
      }
      if (userdata) {
        message.send(new Embed().uhoh(`You've already started farming, ${message.author.username}!`));
      }
    });
  }, {
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    requiresUser: false
  });
}
