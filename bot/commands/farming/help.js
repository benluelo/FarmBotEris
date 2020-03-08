// const { embeds: help } = require("../../lib/help-info.js")

let fullHelpEmbeds, commandHelpEmbeds

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {

  bot.addCommand("help", (message, args, userdata) => {
    if (!args[0]) { message.send(fullHelpEmbeds[userdata.permissions]) }
    else {
      const e = bot.Commands.getEmbed(args, userdata)
      if (e) { return message.send(e) }
      else { message.send(new bot.Embed().uhoh(`${args} isn't a command!`)) }
    }
  }, {
    description: "Show what commands the bot has and how to use them.",
    usage: "​farm help [command]",
    examples: "farm help harvest​",
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 1000
  })
}

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.getHelp = (bot) => {
// remove development commands if in production
  if ((bot.ENV.DEVELOPMENT != "true")) {
    console.log("Removing development commands...")
    for (const cmd in bot.Commands) {
      if (bot.Commands.get(cmd).info.permissionLevel == bot.PERMISSIONS.DEVELOPMENT) {
        bot.Commands.delete(cmd)
      }
    }
  }

  /** @type {Object<string, import("./classes.js").Embed>} */
  commandHelpEmbeds = {}

  /** @type {Object<number, String[]>} */
  const fullHelp = {}

  for (const perm in bot.PERMISSIONS) {
    fullHelp[bot.PERMISSIONS[perm]] = []
  }

  /**
   * @description Maps permission levels to their respective allowed commands, per category.
   * @type {Object<number, {
      CATEGORY_FARMING: String[],
      CATEGORY_UTILITY: String[],
      CATEGORY_OWNER: String[],
      CATEGORY_DEVELOPMENT: String[]
    }>}
  */
  fullHelpEmbeds = Object.fromEntries(Object
    .values(bot.PERMISSIONS)
    .map((val) => {
      return [
        val,
        Object.fromEntries(Object
          .values(bot.CATEGORIES)
          .map((cat) => {
            return [
              cat,
              []
            ]
          })
        )
      ]
    })
  )

  for (const [commandName, commandObject] of bot.Commands.entries()) {
    const current = commandObject
    console.log(current)
    fullHelp[current.info.permissionLevel].push(commandName)

    ;(/**
       * @description Ye.
       * @param {String} cmdName - The name of the command.
       * @param {import("../../lib/FarmBotCommandHandler.js").FarmBotCommand} cmdObject - The command object.
       */
      function getCMDs(cmdName, cmdObject) {
        console.log(cmdObject.info)
        const e = new bot.Embed()
          .setTitle(`Help for \`${cmdName}\``)
          .setDescription(cmdObject.info.description)
          .setColor(0x00b3b3)
          .setFooter("<> - required  |  [] - optional")
          .addField("**__Usage__:**", `\`\`\`${cmdObject.info.usage}\`\`\``)
        if (cmdObject.info.examples) { e.addField("**__Examples__:**", `\`\`\`${cmdObject.info.examples}\`\`\``) }
        if (cmdObject.info.aliases) { e.addField("**__Aliases__:**", `\`\`\`${cmdObject.info.aliases.join(", ")}\`\`\``) }
        e.addField("**__Cooldown__:**", `\`\`\`${cmdObject.info.cooldown / 1000} seconds\`\`\``)
        if (cmdObject.subcommands.size > 0) {
        /** @type {String[]} */
          const subs = Array.from(cmdObject.subcommands.keys())
          e.addField("**__Subcommands__:**", `\`\`\`${subs.join(", ")}\`\`\``)
          subs.forEach((sc) => {
            getCMDs(cmdName + " " + sc, cmdObject.subcommands.get(sc))
          })
        }
        cmdObject.setEmbed(e)
      }
    )(commandName, current)
  }

  // make a different embed for each permission level. each successive level has all the permissions of the previous level.
  for (const i in fullHelp) {
    for (const cmd in fullHelp[i]) {
      for (const permlvl in fullHelpEmbeds) {
        if (i <= permlvl) {
          fullHelpEmbeds[permlvl][bot.Commands.get(fullHelp[i][cmd]).info.category].push(fullHelp[i][cmd])
        }
      }
    }
  }

  // create the actual embeds now lol
  for (const i in fullHelpEmbeds) {
    const PERM_LEVEL = Object.keys(bot.PERMISSIONS).find((key) => {
      return bot.PERMISSIONS[key] == i
    })
    const tempEmbed = new bot.Embed()
      .setTitle("FarmBot Help")
      .setDescription("This is the full list of commands for FarmBot. Send `farm help <command>` for detailed information about a specific command.")
      .setColor(0x00b3b3)
      .setFooter(bot.ENV.DEVELOPMENT ? PERM_LEVEL : null)
    Object.getOwnPropertySymbols(fullHelpEmbeds[i]).forEach((cat) => {
      if (fullHelpEmbeds[i][cat].length != 0) {
        tempEmbed.addField(`**${cat.description}**`, fullHelpEmbeds[i][cat].map((e) => { return `\`${e}\`` }).join(", "))
      }
    })
    fullHelpEmbeds[i] = tempEmbed
  }

  console.log({
    fullHelpEmbeds
  })
}