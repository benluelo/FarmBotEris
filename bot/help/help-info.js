
/**
 * @type {Object<string, HelpObject>}
 */
module.exports = {
  botinfo: {
    description: "Show general information about the bot.",
    usage: "​farm botinfo",
    examples: false,
    permissionLevel: 0,
    category: "utility"
  },
  buy: {
    description: "Buy a new plot for your farm.",
    usage: "Usage:",
    examples: false,
    permissionLevel: 0,
    category: "farming"
  },
  deleteuser: {
    description: "Delete a user from the database.",
    usage: "farm deleteuser [@mention]",
    examples: false,
    permissionLevel: 3,
    category: "development"
  },
  eval: {
    description: "no",
    usage:  "​no",
    examples: "​no",
    permissionLevel: 2
  },
  harvest: {
    description: "To collect all your seeds from your plots",
    usage: "farm harvest [plot]​",
    examples: "​farm harvest a1",
    permissionLevel: 0
  },
  info: {
    description: "To show information on a plot in your farm",
    usage: "​farm info <plot>",
    examples: "​farm info a1",
    permissionLevel: 0
  },
  market: {
    title: "market",
    description: "Shows all the current requests for trading goods",
    usage: "farm market [option]​",
    examples: "farm market view <order id>​\nfarm market fill <order id>",
    permissionLevel: 0
  },
  money: {
    title: "money",
    description: "To view how much <:farmbot_coin:648032810682023956> you have",
    usage: "​farm money",
    examples: false,
    permissionLevel: 0
  },
  inventory: {
    title: "inventory",
    description: "Shows all the items in your inventory",
    usage: "​farm inventory",
    examples: false,
    permissionLevel: 0
  },
  ping: {
    title: "ping",
    description: "To view the time response from the bot to discord",
    usage: "​farm ping",
    examples: false,
    permissionLevel: 0
  },
  help: {
    title: "help",
    description: "To show information about all the commands",
    usage: "​farm help [command]",
    examples: "farm help harvest​",
    permissionLevel: 0
  },
  plant: {
    title: "plant",
    description: "To plant a seed on a plot",
    usage: "​farm plant <plot> <seed>",
    examples: "​farm plant a1 apple\nfarm plant all apple",
    permissionLevel: 0
  },
  plots: {
    title: "plots",
    description: "Shows all your farm plots",
    usage: "​farm plots",
    examples: false,
    permissionLevel: 0
  },
  seeds: {
    title: "seeds",
    description: "To get all the seeds and their prices that they sell for per seed",
    usage: "​farm seeds",
    examples: false,
    permissionLevel: 0
  },
  sell: {
    title: "sell",
    description: null,
    usage:  "​farm sell <plant> [amount]",
    examples: "", // here need edit ____________________________________________________
    permissionLevel: 0
  },
  skills: {
    title: "skills",
    description: "Shows the level of all your seeds",
    usage: "​farm skills [seed]",
    examples: "farm skills apple",
    permissionLevel: 0
  },
  status: {
    title: "status",
    description: "The status of the bot, (more detailed version of `farm botinfo`)",
    usage: "​farm status",
    examples: false,
    permissionLevel: 1
  },
  stop: {
    title: "stop",
    description: "stops/restarts the bot",
    usage: "​farm stop [restart]",
    examples: "​farm stop\nfarm stop restart",
    permissionLevel: 2
  },
  village: {
    title: "village",
    description: "Shows you the village of all the people and their levels",
    usage: "​farm village",
    examples: false,
    permissionLevel: 0
  }
}

/**
 * @typedef {Object} HelpObject
 * @prop {String} description - the description for the command
 * @prop {String} usage - how to use the command.
 * @prop {(String | Boolean)} examples
 * @prop {PermissionLevel} permissionLevel
 * @prop {Category} category
 */

/**
 * The different categories a command can belong in.
 * @typedef {("farming" | "development" | "information" | "admin")} Category
 */

/**
 * The different permission levels for a command.
 *
 * `0`: Everyone
 * `1`: Moderators
 * `2`: Admins
 * `3`: Development
 *
 * @typedef {(0 | 1 | 2 | 3)} PermissionLevel
 */