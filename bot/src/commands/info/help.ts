import CONSTANTS from '../../data/CONSTANTS.js';
import { Embed } from '../../lib/Embed.js';
import { FarmBotClient } from '../../lib/FarmBotClient.js';
import { FarmBotCommand } from '../../lib/FarmBotCommandHandler.js';
import User from '../../lib/User.js';
import Log from '../../logger.js';

type PermissionsValues = typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS];

type HelpEmbedsType = {
  /**
   * The full embed for the permission level. Shows all the commands the user is able to use.
   */
  [P in PermissionsValues]: Embed
};

const genericHelpEmbeds: HelpEmbedsType = Object.values(CONSTANTS.PERMISSIONS)
  .map(val => ({ [val]: new Embed() }))
  .reduce((prev, curr) => ({ ...prev, ...curr }), {}) as { [n in PermissionsValues]: Embed };

export function run(bot: FarmBotClient) {
  bot.addCommand('help', (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error('command `farm help` requires a user data.');
    }
    if (bot.database === undefined) {
      return message.send('Database not yet initialized. Please try again in a moment.');
    }

    if (!args[0]) {
      message.send(genericHelpEmbeds[userdata.permissions]);
    } else {
      const embed = bot.commands.getEmbed(args, User.fromUserData(userdata, message.author));
      if (embed) { return message.send(embed); }
      else { message.send(new Embed().uhoh(`${args} isn't a command!`)); }
    }
  }, {
    description: 'Show what commands the bot has and how to use them.',
    usage: '​farm help [command]',
    examples: 'farm help harvest​',
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.UTILITY,
    cooldown: 1000
  });
}

/**
 * @description Loads the generic help embeds (what the user sees when they send `farm help`).
 * This is to be called ***after*** the commands have all been loaded.
 * @param bot the client.
 */
export function loadHelpEmbeds(bot: FarmBotClient) {
  // // remove development commands if in production
  // console.log(bot.ENV)
  // if ((bot.ENV.DEVELOPMENT !== "true")) {
  //   Log.commandLoad("Removing development commands...")
  //   // console.log(bot.Commands)
  //   for (const [name, cmd] of bot.commands.entries()) {
  //     // console.log(name)
  //     if (cmd.info.permissionLevel === CONSTANTS.PERMISSIONS.DEVELOPMENT) {
  //       console.log(name)
  //       bot.commands.delete(name)
  //     }
  //   }
  // }

  const permissionsLevelToCategoryToCommandsMapMap: Record<PermissionsValues, Record<keyof typeof CONSTANTS.CATEGORIES, string[]>> =
    Object.fromEntries(Object.values(CONSTANTS.PERMISSIONS).map((level) => {
      return [
        level,
        Object.fromEntries(Object.keys(CONSTANTS.CATEGORIES).map((category) => {
          return [category as keyof typeof CONSTANTS.CATEGORIES, [] as string[]] as const;
        })) as Record<keyof typeof CONSTANTS.CATEGORIES, string[]>
      ];
    })) as Record<PermissionsValues, Record<keyof typeof CONSTANTS.CATEGORIES, string[]>>;

  const commandNameCategoryAndPermissions = [...bot.commands.entries()].map(([commandName, commandObject]) => {
    return [commandName, commandObject.info.permissionLevel, commandObject.info.category] as const;
  });
  console.debug('commandNameCategoryAndPermissions: ', commandNameCategoryAndPermissions);
  for (const [commandName, permissionLevel, categorySymbol] of commandNameCategoryAndPermissions) {
    const category = [...Object.entries(CONSTANTS.CATEGORIES) as [keyof typeof CONSTANTS.CATEGORIES, symbol][]].find(([_name, symbol]) => symbol === categorySymbol)!;
    console.log('permissionLevel: ', permissionLevel, 'commandName: ', commandName, 'category: ', category);
    // FIXME: don't use a constant `3` here
    for (let i = permissionLevel; i <= 3; ++i) {
      console.log(i, commandName, permissionLevel, categorySymbol);
      permissionsLevelToCategoryToCommandsMapMap[i][category[0]].push(commandName);
    }
  }

  // create the actual embeds now lol
  for (const [permissionLevel, embed] of Object.entries(genericHelpEmbeds)) {
    embed
      .setTitle('FarmBot Help')
      .setDescription('This is the full list of commands for FarmBot. Send `farm help <command> [subcommands...]` for detailed information about a specific command.')
      .setColor(0x00b3b3)
      .setFooter(bot.ENV.DEVELOPMENT ? permissionLevel : '');

    const temp = Object.entries(permissionsLevelToCategoryToCommandsMapMap[permissionLevel as unknown as PermissionsValues]) as [keyof typeof CONSTANTS.CATEGORIES, string[]][];
    console.log(temp);
    for (const [category, commands] of temp) {
      const allCommands = commands.map(cmd => `${cmd}`).join(', ');
      console.log(permissionLevel, allCommands, commands);
      embed.addField(CONSTANTS.CATEGORIES[category].description ?? 'error', allCommands);
    }
  }

  console.log({
    fullHelpEmbeds: genericHelpEmbeds
  });
}
