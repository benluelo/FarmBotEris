/**
 * @typedef {Object} CommandHelpObject
 * @prop {String} description - the description for the command.
 * @prop {String} usage - how to use the command.
 * @prop {(String | Boolean)} examples - examples of how to use the command. `false` if there are no examples.
 * @prop {PermissionsLevels} permissionLevel
 * @prop {CategoriesSymbol} category
 */

/**
 * @typedef {(0 | 1 | 2 | 3)} PermissionsLevels
 */
/**
 * @typedef {Symbol} CategoriesSymbol
 */

/**
 * The different permission levels for a command.
 * @typedef {Object} PERMISSIONS
 * @property {PermissionsLevels} EVERYONE - commands that everyone has access to.
 * @property {PermissionsLevels} MODERATORS - commands that only bot moderators have access to.
 * @property {PermissionsLevels} OWNERS - commands that only bot admins have access to.
 * @property {PermissionsLevels} DEVELOPMENT - commands that are only to be used by the developers (i.e. only Ben & Tyler).
 */
/**
 * @type {PERMISSIONS}
 */
const PERMISSIONS = Object.freeze({
  EVERYONE: 0,
  MODERATORS: 1,
  OWNERS: 2,
  DEVELOPMENT: 3
})

/**
 * The different categories of commands.
 * @typedef {Object} CATEGORIES
 * @property {CategoriesSymbol} FARMING - commands related to farming.
 * @property {CategoriesSymbol} UTILITY - useful commands for information about the bot.
 * @property {CategoriesSymbol} OWNER - commands that are only to be used by the owners (i.e. only Ben & Tyler).
 * @property {CategoriesSymbol} DEVELOPMENT - commands used for bot development.
 */
/**
 * @type {CATEGORIES}
 */
const CATEGORIES = Object.freeze({
  FARMING: Symbol("🌱 Farming"),
  UTILITY: Symbol("⚙️ Utility"),
  OWNER: Symbol("🥑 Owner"),
  DEVELOPMENT: Symbol("📜 Development")
})

/** @type {Object<string, CommandHelpObject>} */
const commands = {
  botinfo: {
    description: "Show general utility about the bot.",
    usage: "​farm botinfo",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY
  },
  buy: {
    description: "Buy a new plot for your farm.",
    usage: "farm buy",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  deleteuser: {
    description: "Delete a user from the database.",
    usage: "farm deleteuser [@mention]",
    examples: false,
    permissionLevel: PERMISSIONS.DEVELOPMENT,
    category: CATEGORIES.DEVELOPMENT
  },
  eval: {
    description: "no",
    usage:  "​no",
    examples: "​no",
    permissionLevel: PERMISSIONS.OWNERS,
    category: CATEGORIES.OWNER
  },
  harvest: {
    description: "Harvest your crops.",
    usage: "farm harvest [plot]​",
    examples: "​farm harvest a1",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  info: {
    description: "To show utility on a plot in your farm",
    usage: "​farm info <plot>",
    examples: "​farm info a1",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY
  },
  market: {
    title: "market",
    description: "Shows all the current requests for trading goods",
    usage: "farm market [option]​",
    examples: "farm market view <order id>​\nfarm market fill <order id>",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  money: {
    title: "money",
    description: `View your current ${require("./emoji.json").coin} balance.`,
    usage: "​farm money",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  inventory: {
    title: "inventory",
    description: "Shows all the items in your inventory",
    usage: "​farm inventory",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  ping: {
    title: "ping",
    description: "To view the time response from the bot to discord",
    usage: "​farm ping",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY
  },
  help: {
    title: "help",
    description: "To show utility about all the commands",
    usage: "​farm help [command]",
    examples: "farm help harvest​",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.UTILITY
  },
  plant: {
    title: "plant",
    description: "To plant a seed on a plot",
    usage: "​farm plant <plot> <seed>",
    examples: "​farm plant a1 apple\nfarm plant all apple",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  plots: {
    title: "plots",
    description: "Shows all your farm plots",
    usage: "​farm plots",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  seeds: {
    title: "seeds",
    description: "To get all the seeds and their prices that they sell for per seed",
    usage: "​farm seeds",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  sell: {
    title: "sell",
    description: "Sell a crop in your inventory.",
    usage:  "​farm sell <amount> <crop>",
    examples: "farm sell 45 apple\nfarm sell all apple", // here need edit _______________i don't know what you changed________ i hadnt done anything yet ill get it tho ------------ oh okay -- fucking ctrl-s
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  skills: {
    title: "skills",
    description: "Shows the level of all your seeds",
    usage: "​farm skills [seed]",
    examples: "farm skills apple",
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  status: {
    title: "status",
    description: "The status of the bot, (more detailed version of `farm botinfo`)",
    usage: "​farm status",
    examples: false,
    permissionLevel: PERMISSIONS.MODERATORS,
    category: CATEGORIES.UTILITY
  },
  stop: {
    title: "stop",
    description: "stops/restarts the bot",
    usage: "​farm stop [restart]",
    examples: "​farm stop\nfarm stop restart",
    permissionLevel: PERMISSIONS.DEVELOPMENT,
    category: CATEGORIES.UTILITY
  },
  village: {
    title: "village",
    description: "Shows you the village of all the people and their levels",
    usage: "​farm village",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
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

const { Embed } = require("../lib/classes")

/** @type {Object<string, import("../lib/classes.js").Embed>} */
const helpEmbeds = {}

const fullHelp = {}

for (const perm in PERMISSIONS) {
  fullHelp[PERMISSIONS[perm]] = []
}

/**
 * @type {Object<number, {
    CATEGORY_FARMING: String[],
    CATEGORY_UTILITY: String[],
    CATEGORY_OWNER: String[],
    CATEGORY_DEVELOPMENT: String[]
  }>}
 */
const fullHelpEmbeds = Object.fromEntries(Object.values(PERMISSIONS).map(((val) => {
  return [val, Object.fromEntries(Object.values(CATEGORIES).map(((cat) => {
    return [cat, []]
  })))]
})))

for (const command in commands) {
  const current = commands[command]
  fullHelp[current.permissionLevel].push(command)
  const e = new Embed()
    .setTitle(`Help for \`${command}\``)
    .setDescription(current.description)
    .setColor(0x00b3b3)
    .setFooter("<> - required  |  [] - optional")
    .addField("**__Usage__:**", `\`\`\`${current.usage}\`\`\``)
  if (current.examples) { e.addField("**__Examples__:**", `\`\`\`${current.examples}\`\`\``) }
  helpEmbeds[command] = e
}

// make a different embed for each permission level. each successive level has all the permissions of the previous level.

for (const i in fullHelp) {
  for (const com in fullHelp[i]) {
    for (const permlvl in fullHelpEmbeds) {
      if (i <= permlvl) {
        fullHelpEmbeds[permlvl][commands[fullHelp[i][com]].category].push(fullHelp[i][com])
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
  helpEmbeds
}