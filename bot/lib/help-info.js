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
 * @property {PermissionsLevels} ADMINS - commands that only bot admins have access to.
 * @property {PermissionsLevels} DEVELOPERS - commands that are only to be used by the developers (i.e. only Ben & Tyler).
 */
/**
 * @type {PERMISSIONS}
 */
const PERMISSIONS = Object.freeze({
  EVERYONE: 0,
  MODERATORS: 1,
  ADMINS: 2,
  DEVELOPERS: 3
})

/**
 * The different categories of commands.
 * @typedef {Object} CATEGORIES
 * @property {CategoriesSymbol} FARMING - commands related to farming.
 * @property {CategoriesSymbol} DEVELOPMENT - commands used for bot development.
 * @property {CategoriesSymbol} UTILITY - useful commands for information about the bot.
 * @property {CategoriesSymbol} OWNER - commands that are only to be used by the owners (i.e. only Ben & Tyler).
 */
/**
 * @readonly
 * @type {CATEGORIES}
 */
const CATEGORIES = Object.freeze({
  FARMING: Symbol("farming"),
  UTILITY: Symbol("utility"),
  OWNER: Symbol("owner"),
  DEVELOPMENT: Symbol("development")
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
    usage: "Usage:",
    examples: false,
    permissionLevel: PERMISSIONS.EVERYONE,
    category: CATEGORIES.FARMING
  },
  deleteuser: {
    description: "Delete a user from the database.",
    usage: "farm deleteuser [@mention]",
    examples: false,
    permissionLevel: PERMISSIONS.DEVELOPERS,
    category: CATEGORIES.DEVELOPMENT
  },
  eval: {
    description: "no",
    usage:  "​no",
    examples: "​no",
    permissionLevel: PERMISSIONS.DEVELOPERS,
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
    description: null,
    usage:  "​farm sell <plant> [amount]",
    examples: "", // here need edit _______________i don't know what you changed________ i hadnt done anything yet ill get it tho ------------ oh okay -- fucking ctrl-s
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
    permissionLevel: PERMISSIONS.DEVELOPERS,
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

const { Embed } = require("../lib/classes")

/** @type {Object<string, import("../lib/classes.js").Embed>} */
const helpEmbeds = {}

const fullHelp = {}

for (const perm in PERMISSIONS) {
  fullHelp[PERMISSIONS[perm]] = []
}

console.log(fullHelp)

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
  console.log(current)
  fullHelp[current.permissionLevel].push(command)
  const e = new Embed()
    .setTitle(`Help for \`${command}\``)
    .setDescription(current.description)
    .addField("**__Usage__:**", `\`\`\`${current.usage}\`\`\``)
  if (current.examples) { e.addField("**__Examples__:**", `\`\`\`${current.examples}\`\`\``) }
  helpEmbeds[command] = e
}
console.log(fullHelp)

// make a different embed for each permission level. each successive level has all the permissions of the previous level.


console.log(fullHelpEmbeds)

for (const permission in fullHelp) {
  console.log("permission level:", permission)
  for (const category in fullHelp[permission]) {
    console.log("category:", fullHelp[permission][category], commands[fullHelp[permission][category]].category)
  }
}

module.exports = {
  PERMISSIONS,
  CATEGORIES
}