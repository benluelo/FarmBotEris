/**
 * @typedef {Object} CommandHelpObject
 * @prop {String} description - The description for the command.
 * @prop {String} usage - How to use the command.
 * @prop {String} [examples] - Examples of how to use the command.
 * @prop {PermissionsLevels} permissionLevel
 * @prop {Symbol} category - The category the command belongs in.
 * @prop {String[]} [aliases] - An array of aliases for the command.
 * @prop {Number} cooldown - The cooldown for the command, in `ms`.
 * @prop {Object<string, CommandHelpObject>} [subcommands] - An object mapping any subcommands that the command may have to their respective {@link CommandHelpObject}.
 */

/**
 * @typedef {(0 | 1 | 2 | 3)} PermissionsLevels
 */

/** @description The different permission levels for a command. */
const PERMISSIONS = Object.freeze({
  /** @type {0} Commands that everyone has access to. */
  EVERYONE: 0,
  /** @type {1} Commands that only bot moderators have access to. */
  MODERATORS: 1,
  /** @type {2} Commands that only bot admins have access to. */
  OWNERS: 2,
  /** @type {3} Commands that are only to be used by the developers, during development (i.e. only Ben & Tyler). */
  DEVELOPMENT: 3
})

/** @description The different categories of commands. */
const CATEGORIES = Object.freeze({
  /** @type {Symbol} Commands related to farming. */
  FARMING: Symbol("🌱 Farming"),
  /** @type {Symbol} Useful commands for information about the bot. */
  UTILITY: Symbol("⚙️ Utility"),
  /** @type {Symbol} Commands that are only to be used by the owners (i.e. only Ben & Tyler). */
  OWNER: Symbol("🥑 Owner"),
  /** @type {Symbol} Commands used for bot development. */
  DEVELOPMENT: Symbol("📜 Development")
})

/** @type {Object<string, CommandHelpObject>} */
const commands = {
  botinfo: {
    description: "Show general utility about the bot.",
    usage: "​farm botinfo",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 3000,
    subcommands: null
  },
  buy: {
    description: "Show the price of the next farm plot.",
    usage: "farm buy",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 3000,
    subcommands: {
      confirm: {
        description: "Buy a new plot for your farm.",
        usage: "farm buy confirm",
        permissionLevel: PERMISSIONS.EVERYONE,
        category: CATEGORIES.FARMING,
        aliases: null,
        cooldown: 3000,
        subcommands: null
      }
    }
  },
  deleteuser: {
    description: "Delete a user from the database.",
    usage: "farm deleteuser [@mention]",
    examples: false,
    permissionLevel: PERMISSIONS.DEVELOPMENT,
    category: CATEGORIES.DEVELOPMENT,
    aliases: null,
    cooldown: 0,
    subcommands: null
  },
  eval: {
    description: "no",
    usage:  "​no",
    examples: "​no",
    permissionLevel: PERMISSIONS.OWNERS,
    category: CATEGORIES.OWNER,
    aliases: null,
    cooldown: 0,
    subcommands: null
  },
  harvest: {
    description: "Harvest your crops.",
    usage: "farm harvest [plot]​",
    examples: "​farm harvest a1\n└> harvest a specific plot.\nfarm harvest└> harvest all of your crops.",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000,
    subcommands: null
  },
  info: {
    description: "To show utility on a plot in your farm",
    usage: "​farm info <plot>",
    examples: "​farm info a1",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 3000,
    subcommands: null
  },
  market: {
    description: "Show all current market requests.",
    usage: "farm market",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 10000,
    subcommands: {
      view: {
        description: "Show a specific market request.",
        usage: "farm market view <order id>​",
        permissionLevel: PERMISSIONS.EVERYONE,
        category: CATEGORIES.FARMING,
        aliases: ["info"],
        cooldown: 5000,
        subcommands: null
      },
      fill: {
        description: "Fill a market request.",
        usage: "farm market fill <order id>​",
        permissionLevel: PERMISSIONS.EVERYONE,
        category: CATEGORIES.FARMING,
        aliases: null,
        cooldown: 5000,
        subcommands: null
      }
    }
  },
  money: {
    description: `View your current ${require("./emoji.json").coin} balance.`,
    usage: "​farm money",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: ["cash"],
    cooldown: 2000,
    subcommands: null
  },
  inventory: {
    description: "Shows all the items in your inventory",
    usage: "​farm inventory",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: ["inv"],
    cooldown: 3000,
    subcommands: null
  },
  ping: {
    description: "To view the time response from the bot to discord",
    usage: "​farm ping",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 1000,
    subcommands: null
  },
  help: {
    description: "To show utility about all the commands",
    usage: "​farm help [command]",
    examples: "farm help harvest​",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 1000,
    subcommands: null
  },
  plant: {
    description: "Plants a seed on the specified plot.",
    usage: "​farm plant <plot> <seed>",
    examples: "​farm plant a1 apple",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000,
    subcommands: {
      all: {
        description: "Plants a seed on all available plots.",
        usage: "​farm plant all <seed>",
        examples: "​farm plant all apple",
        permissionLevel: PERMISSIONS.EVERYONE,
        category: CATEGORIES.FARMING,
        aliases: null,
        cooldown: 5000,
        subcommands: null // hello lmao
      }
    }
  },
  plots: {
    description: "Show an overview of your farm.",
    usage: "​farm plots",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 10000,
    subcommands: null
  },
  seeds: {
    description: "To get all the seeds and their prices that they sell for per seed",
    usage: "​farm seeds",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 3000,
    subcommands: null
  },
  sell: {
    description: "Sell a crop in your inventory.",
    usage:  "​farm sell <amount> <crop>",
    examples: "farm sell 12 apple",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 3000,
    subcommands: {
      all: {
        description: "Sell all of a crop in your inventory.",
        usage:  "​farm sell <amount> <crop>",
        examples: "farm sell all apple",
        permissionLevel: PERMISSIONS.EVERYONE,
        category: CATEGORIES.FARMING,
        aliases: null,
        cooldown: 5000,
        subcommands: null
      }
    }
  },
  skills: {
    description: "Shows the level of all your seeds",
    usage: "​farm skills [seed]",
    examples: "farm skills apple",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000,
    subcommands: null
  },
  status: {
    description: "The status of the bot. (more detailed version of `farm botinfo`)",
    usage: "​farm status",
    examples: false,
    permissionLevel: PERMISSIONS.MODERATORS,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 0,
    subcommands: null
  },
  stop: {
    description: "Stops the bot.",
    usage: "​farm stop",
    examples: "​farm stop",
    permissionLevel: PERMISSIONS.DEVELOPMENT,
    category: CATEGORIES.UTILITY,
    aliases: null,
    cooldown: 0,
    subcommands: {
      restart: {
        description: "Restarts the bot",
        usage: "​farm stop restart",
        examples: "​farm stop restart",
        permissionLevel: PERMISSIONS.DEVELOPMENT,
        category: CATEGORIES.UTILITY,
        aliases: null,
        cooldown: 0,
        subcommands: null
      }
    }
  },
  village: {
    description: "Shows you the village of all the people and their levels",
    usage: "​farm village",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING,
    aliases: null,
    cooldown: 5000,
    subcommands: null
  }
}

// remove development commands if in production
if (!(process.env.DEVELOPMENT == "true")) {
  for (const cmd in commands) {
    if (commands[cmd].permissionLevel == PERMISSIONS.DEVELOPMENT) {
      delete commands[cmd]
    }
  }
}

const Embed = require("./classes").Embed

/** @type {Object<string, Embed>} */
const commandHelpEmbeds = {}

/** @type {Object<number, String[]>} */
const fullHelp = {}

for (const perm in PERMISSIONS) {
  fullHelp[PERMISSIONS[perm]] = []
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
const fullHelpEmbeds = Object.fromEntries(Object
  .values(PERMISSIONS)
  .map((val) => {
    return [
      val,
      Object.fromEntries(Object
        .values(CATEGORIES)
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

for (const command in commands) {
  const current = commands[command]
  fullHelp[current.permissionLevel].push(command)

  ;(/**
     * @description Ye.
     * @param {String} cmdName - The name of the command.
     * @param {CommandHelpObject} cmdObject - The object of the command.
     * @param {String} [parent] - The parent command if this is a subcommand.
     */
    function getCMDs(cmdName, cmdObject, parent) {
      const e = new Embed()
        .setTitle(`Help for \`${cmdName}\``)
        .setDescription(cmdObject.description)
        .setColor(0x00b3b3)
        .setFooter("<> - required  |  [] - optional")
        .addField("**__Usage__:**", `\`\`\`${cmdObject.usage}\`\`\``)
      if (cmdObject.examples) { e.addField("**__Examples__:**", `\`\`\`${cmdObject.examples}\`\`\``) }
      if (cmdObject.aliases) { e.addField("**__Aliases__:**", `\`\`\`${cmdObject.aliases.join(", ")}\`\`\``) }
      e.addField("**__Cooldown__:**", `\`\`\`${cmdObject.cooldown / 1000} seconds\`\`\``)
      if (cmdObject.subcommands) {
        const subs = Object.keys(cmdObject.subcommands)
        e.addField("**__Subcommands__:**", `\`\`\`${subs.join(", ")}\`\`\``)
        subs.forEach((sc) => {
          // console.log(cmdObject.subcommands[sc])
          getCMDs(cmdName + " " + sc, cmdObject.subcommands[sc], cmdName)
        })
      }
      commandHelpEmbeds[cmdName] = e
    }
  )(command, current)
}

// console.log(JSON.stringify(Object.keys(commandHelpEmbeds), null, 4, true))

// make a different embed for each permission level. each successive level has all the permissions of the previous level.
for (const i in fullHelp) {
  for (const cmd in fullHelp[i]) {
    for (const permlvl in fullHelpEmbeds) {
      if (i <= permlvl) {
        fullHelpEmbeds[permlvl][commands[fullHelp[i][cmd]].category].push(fullHelp[i][cmd])
      }
    }
  }
}

// create the actual embeds now lol
for (const i in fullHelpEmbeds) {
  const PERM_LEVEL = Object.keys(PERMISSIONS).find((key) => {
    return PERMISSIONS[key] == i
  })
  const tempEmbed = new Embed()
    .setTitle("FarmBot Help")
    .setDescription("This is the full list of commands for FarmBot. Send `farm help <command>` for detailed information about a specific command.")
    .setColor(0x00b3b3)
    .setFooter(process.env.DEVELOPMENT ? PERM_LEVEL : null)
  Object.getOwnPropertySymbols(fullHelpEmbeds[i]).forEach((cat) => {
    if (fullHelpEmbeds[i][cat].length != 0) {
      tempEmbed.addField(`**${cat.description}**`, fullHelpEmbeds[i][cat].map((e) => { return `\`${e}\`` }).join(", "))
    }
  })
  fullHelpEmbeds[i] = tempEmbed
}

module.exports = {
  PERMISSIONS,
  CATEGORIES,
  fullHelpEmbeds,
  commandHelpEmbeds,
  commands
}

console.log(Object.keys(commandHelpEmbeds))