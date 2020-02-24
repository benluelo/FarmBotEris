/**
 * @typedef {Object} CommandHelpObject
 * @prop {String} description - the description for the command
 * @prop {String} usage - how to use the command.
 * @prop {(String | Boolean)} examples - examples of how to use the command. `false` if there are no examples.
 * @prop {PermissionsSymbol} permissionLevel
 * @prop {CategoriesSymbol} category
 */

/**
 * @typedef {Symbol} PermissionsSymbol
 */
/**
 * @typedef {Symbol} CategoriesSymbol
 */

/**
 * The different permission levels for a command.
 * @readonly
 * @type {Object<string, PermissionsSymbol>}
 */
const PERMISSIONS = {
  EVERYONE: Symbol("everyone"),
  MODERATORS: Symbol("moderators"),
  OWNERS: Symbol("owners"),
  /** Only to be used for development purposes. */
  DEVELOPMENT: Symbol("development")
}

/**
 * The different categories of commands.
 * @readonly
 * @type {Object<string, CategoriesSymbol>}
 */
const CATEGORIES = {
  FARMING: Symbol("farming"),
  DEVELOPER: Symbol("development"),
  UTILITY: Symbol("utility"),
  OWNER: Symbol("owner")
}

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
    permissionLevel: PERMISSIONS.DEVELOPMENT,
    category: CATEGORIES.DEVELOPER
  },
  eval: {
    description: "no",
    usage:  "​no",
    examples: "​no",
    permissionLevel: PERMISSIONS.OWNERS,
    category: CATEGORIES.OWNER
  },
  harvest: {
    description: "To collect all your seeds from your plots",
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
    description: "To view how much <:farmbot_coin:648032810682023956> you have",
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
    category: CATEGORIES.OWNER
  },
  stop: {
    title: "stop",
    description: "stops/restarts the bot",
    usage: "​farm stop [restart]",
    examples: "​farm stop\nfarm stop restart",
    permissionLevel: PERMISSIONS.OWNERS,
    category: CATEGORIES.OWNER
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

const fullHelpEmbeds = {}

for (const perm in PERMISSIONS) {
  fullHelpEmbeds[PERMISSIONS[perm]] = []
}

for (const command in commands) {
  const current = commands[command]
  fullHelpEmbeds[current.permissionLevel].push(command)
  const e = new Embed()
    .setTitle(`Help for \`${command}\``)
    .setDescription(current.description)
    .addField("**__Usage__:**", `\`\`\`${current.usage}\`\`\``)
  if (current.examples) { e.addField("**__Examples__:**", `\`\`\`${current.examples}\`\`\``) }
  helpEmbeds[command] = e
}

console.log(fullHelpEmbeds)

module.exports = {
  PERMISSIONS,
  CATEGORIES
}