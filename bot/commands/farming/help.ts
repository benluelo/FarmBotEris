// const { embeds: help } = require("../../lib/help-info.js")

import CONSTANTS from "../../lib/CONSTANTS.js"
import { Embed } from "../../lib/Embed.js"
import { FarmBotClient } from "../../lib/FarmBotClient.js"
import { FarmBotCommand } from "../../lib/FarmBotCommandHandler.js"
import Log from "../../src/logger.js"

let fullHelpEmbeds: {
  [P in typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]]: {
    [C in keyof typeof CONSTANTS.CATEGORIES as `CATEGORY_${C}`]: Embed[]
  }
}

export default (bot: FarmBotClient) => {
  bot.addCommand("help", (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error("command `farm sell` requires a user data.")
    }
    if (bot.database === undefined) {
      return message.send("Database not yet initialized. Please try again in a moment.")
    }

    // @ts-ignore
    if (!args[0]) { message.send(fullHelpEmbeds[userdata.permissions]) }
    else {
      // @ts-ignore
      const embed = bot.commands.getEmbed(args, userdata)
      if (embed) { return message.send(embed) }
      else { message.send(new Embed().uhoh(`${args} isn't a command!`)) }
    }
  }, {
    description: "Show what commands the bot has and how to use them.",
    usage: "​farm help [command]",
    examples: "farm help harvest​",
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.UTILITY,
    cooldown: 1000
  })
}

// TODO: wtf is going on here lol
export function getHelp(bot: FarmBotClient) {
  // remove development commands if in production
  if ((bot.ENV.DEVELOPMENT !== "true")) {
    Log.commandLoad("Removing development commands...")
    // console.log(bot.Commands)
    for (const [name, cmd] of bot.commands.entries()) {
      // console.log(name)
      if (cmd.info.permissionLevel === CONSTANTS.PERMISSIONS.DEVELOPMENT) {
        console.log(name)
        bot.commands.delete(name)
      }
    }
  }

  const fullHelp: Record<number, string[]> = {}

  for (const [_perm, level] of Object.entries(CONSTANTS.PERMISSIONS)) {
    fullHelp[level] = []
  }

  /**
   * @description Maps permission levels to their respective allowed commands, per category.
   */
  // @ts-ignore
  fullHelpEmbeds = Object.fromEntries(
    (Object.values(CONSTANTS.PERMISSIONS) as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS][])
      .map((val) => {
        return [
          val,
          Object.fromEntries(
            (Object.entries(CONSTANTS.CATEGORIES) as [keyof typeof CONSTANTS.CATEGORIES, symbol][])
              .map(([categoryName, _categorySymbol]) => {
                return [
                  categoryName,
                  [] as string[]
                ]
              })
          )
        ]
      })
  ) as {
      [P in typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]]: {
        [C in keyof typeof CONSTANTS.CATEGORIES as `CATEGORY_${C}`]: string[]
      }
    }

  /**
   * @description Ye.
   * @param commandName - The name of the command.
   * @param commandObject - The command object.
   */
  function getCMDs(commandName: string, commandObject: FarmBotCommand) {
    const embed = new Embed()
      .setTitle(`Help for \`${commandName}\``)
      .setDescription(commandObject.info.description)
      .setColor(0x00b3b3)
      .setFooter("<> - required  |  [] - optional")
      .addField("**__Usage__:**", `\`\`\`${commandObject.info.usage}\`\`\``)
    if (commandObject.info.examples) {
      embed.addField("**__Examples__:**", `\`\`\`${commandObject.info.examples}\`\`\``)
    }
    if (commandObject.info.aliases) {
      embed.addField("**__Aliases__:**", `\`\`\`${commandObject.info.aliases.join(", ")}\`\`\``)
    }
    embed.addField("**__Cooldown__:**", `\`\`\`${commandObject.info.cooldown / 1000} seconds\`\`\``)
    if (commandObject.subcommands.size() > 0) {
      embed.addField("**__Subcommands__:**", `\`\`\`${[...commandObject.subcommands.entries()].map(([subcommandName, _subcommandObject]) => subcommandName).join(", ")}\`\`\``)
      for (const [name, subcommand] of commandObject.subcommands.entries())
        getCMDs(commandName + " " + name, subcommand)
    }
    commandObject.setEmbed(embed)
  }

  for (const [commandName, commandObject] of bot.commands.entries()) {
    const current = commandObject
    fullHelp[current.info.permissionLevel].push(commandName);

    getCMDs(commandName, current)
  }

  // make a different embed for each permission level. each successive level has all the permissions of the previous level.
  for (const i in fullHelp) {
    for (const cmd in fullHelp[i]) {
      for (const permlvl in fullHelpEmbeds) {
        if (parseInt(i) <= parseInt(permlvl)) {
          // @ts-ignore
          fullHelpEmbeds[parseInt(permlvl) as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]][bot.commands.get(fullHelp[parseInt(i)][cmd])!.info.category].push(fullHelp[i][cmd])
        }
      }
    }
  }

  // create the actual embeds now lol
  for (const i in fullHelpEmbeds) {
    const PERM_LEVEL = Object.keys(CONSTANTS.PERMISSIONS).find((key) => {
      return CONSTANTS.PERMISSIONS[key as keyof typeof CONSTANTS.PERMISSIONS] === i as unknown as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]
    })!
    const tempEmbed = new Embed()
      .setTitle("FarmBot Help")
      .setDescription("This is the full list of commands for FarmBot. Send `farm help <command> [subcommands...]` for detailed information about a specific command.")
      .setColor(0x00b3b3)
      .setFooter(bot.ENV.DEVELOPMENT ? PERM_LEVEL : "")
    Object.entries(fullHelpEmbeds[i as unknown as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]]).forEach(([categoryName, categorySymbol]) => {
      if (fullHelpEmbeds[i as unknown as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]][categoryName as `CATEGORY_${keyof typeof CONSTANTS.CATEGORIES}`].length !== 0) {
        // @ts-ignore
        tempEmbed.addField(`**${categorySymbol.description}**`, fullHelpEmbeds[i as unknown as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]][categoryName].map((e) => { return `\`${e}\`` }).join(", "))
      }
    })
    // @ts-ignore
    fullHelpEmbeds[i as unknown as typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]] = tempEmbed
  }

  console.log({
    fullHelpEmbeds
  })
}