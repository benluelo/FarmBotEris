const util = require("util")
const CONSTANTS = require("./CONSTANTS.js")
console.log(CONSTANTS)
// const chalk = require("chalk")
// const customclass = chalk.keyword("orange")
// const userid = chalk.keyword("purple")

/**
 * @module FarmBot
 */
/**
 * @typedef {function(import("eris").Message, String[], import("./user.js").User): void} CommandFunction
 */

/**
 */
class CommandInformation {
  /**
   * @description The general information about a command.
   * @param {Object} [info]
   * @param {String} [info.description="No description provided."] - The description for the command.
   * @param {String} [info.usage="No usage provided."] - How to use the command.
   * @param {String} [info.examples] - Examples of how to use the command.
   * @param {(0 | 1 | 2 | 3)} [info.permissionLevel=CONSTANTS.PERMISSIONS.DEVELOPMENT] - The minimum required permission level for the command.
   * @param {Symbol} [info.category=CONSTANTS.CATEGORIES.DEVELOPMENT] - The category the command belongs in.
   * @param {String[]} [info.aliases] - An array of aliases for the command.
   * @param {Number} [info.cooldown=0] - The cooldown for the command, in `ms`.
   * @param {Boolean} [info.requiresUser=false] - Whether or not the command requires a userdata to run.
   */
  constructor(info = {
    description: "No description provided.",
    usage: "No usage provided.",
    examples: null,
    permissionLevel: CONSTANTS.PERMISSIONS.DEVELOPMENT,
    category: CONSTANTS.CATEGORIES.DEVELOPMENT,
    aliases: null,
    cooldown: 0,
    requiresUser: false,
  }) {
    /** @type {String} The description for the command. */
    this.description = info.description
    /** @type {String} How to use the command. */
    this.usage = info.usage
    /** @type {String} Examples of how to use the command. */
    this.examples = info.examples
    /** @type {(0 | 1 | 2 | 3)} */
    this.permissionLevel = info.permissionLevel
    /** @type {Symbol} The category the command belongs in. */
    this.category = info.category
    /** @type {String[]} An array of aliases for the command. */
    this.aliases = info.aliases
    /** @type {Number} The cooldown for the command, in `ms`. */
    this.cooldown = info.cooldown
    /** @type {Boolean} Whether or not the command requires a userdata to run. */
    this.requiresUser = info.requiresUser != undefined ? info.requiresUser : false
  }
}

/** @typedef {FarmBotCommand} FarmBotCommand */
class FarmBotCommand {
  /**
   * @description Makes a command for the bot.
   * @param {String} name - The name of the command.
   * @param {CommandFunction} func - The command.
   * @param {CommandInformation} info - The information for the command.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   */
  constructor(name, func, info, parent) {
    this.name = name
    /** @type {CommandFunction} */
    this.func = Object.defineProperty(func, "name", {
      value: name,
      writable: false
    })
    this.info = info
    this.parent = parent
    this.subcommands = new FarmBotCommandHandler()
  }

  getFullCommandName() {
    return (this.parent ? this.parent.getFullCommandName() + " " : "" ) + this.name
  }

  /**
   * @description Runs the command.
   * @param {import("eris").Message} msg - The message that was sent.
   * @param {String[]} args - The command arguments.
   * @param {import("./user.js").User} userdata - The caller's DB information.
   */
  run(msg, args, userdata) {
    if (this.subcommands.size != 0 && this.subcommands.has(args[0])) {
      this.subcommands.get(args.shift()).run(msg, args, userdata)
    } else {
      if (userdata.permissions < this.info.permissionLevel) { return }
      const TTW = msg._client.Cooldowns.check(msg.author.id, this.getFullCommandName())
      if (TTW > 0) {
        msg.send(`**${msg.author.username}**, you have to wait **${(TTW / 1000).toFixed(2)}** seconds to use \`farm ${this.getFullCommandName()}\`!`)
      } else {
        this.func(msg, args, userdata)
      }
    }
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param {String} name - The name of the subcommand.
   * @param {CommandFunction} func - The subcommand.
   * @param {{
        description?: string,
        usage?: string,
        examples?: string,
        permissionLevel?: (0 | 1 | 2 | 3),
        category?: Symbol,
        aliases?: string[],
        cooldown?: number,
        requiresUser?: boolean,
      }} info - The information for the command.
   * @returns {FarmBotCommand} The new subcommand object.
   */
  subcommand(name, func, info) {
    return this.subcommands.set(name, func, new CommandInformation(info), this)
  }

  /**
   * @description Sets the help embed for the command.
   * @param {import("./classes.js").Embed} embed - The help embed for this command.
   */
  setEmbed(embed) {
    this.embed = embed
  }

  /**
   * @description Gets the help embed for the command.
   * @param {String[]} args - The name of the command to get the help embed for.
   * @param {import("./user.js").User} userdata - The user's DB information.
   * @returns {(import("./classes.js").Embed | undefined)} The help embed for this command, or `false` if their permmissions aren't high enough.
   */
  getEmbed(args, userdata) {
    console.log(this.name, args)
    if (args[0] && this.subcommands.size != 0 && this.subcommands.has(args[0])) {
      return this.subcommands.get(args.shift()).getEmbed(args, userdata)
    } else {
      if (userdata.permissions < this.info.permissionLevel) { return undefined }
      else { return this.embed }
    }
  }

  // eslint-disable-next-line no-unused-vars
  [util.inspect.custom](_depth, _options) {
    // const SPACER = depth.toString()
    // switch (depth) {
    //   case (0): {
    //     return options.stylize(`[${this.constructor.name}: ${this.getFullCommandName()}]`, "special")
    //   }
    //   default: {
    //     return `{\n${SPACER.repeat(depth)}name: ${this.name},\n${SPACER.repeat(depth)}cooldown: ${this.info.cooldown},\n${SPACER.repeat(depth)}subcommands: ${util.inspect(this.subcommands, true, depth + 1, true)}\n${SPACER.repeat(depth - 1)}}`
    //   }
    // }
    const toReturn = {
      name: this.name,
      info: this.info
    }
    this.parent ? toReturn.parent = this.parent.name : null,
    this.subcommands.size > 0 ? toReturn.subcommands = this.subcommands : null
    return util.inspect(toReturn, true, 1, true).replace(" [Map] ", " ")
  }
}

class FarmBotCommandHandler extends Map {
  constructor() {
    super()
    /** @type {Map<string, string>} A map of command aliases to their respective commands. */
    this.aliases = new Map()
  }

  /**
   * @description Runs thespecified command.
   * @param {String} cmdName - The name of the command to run.
   * @param {import("eris").Message} message - The message that was sent.
   * @param {String[]} args - The command arguments.
   * @param {import("./user.js").User} userdata - The user's DB information.
   */
  run(cmdName, message, args, userdata) {
    this.get(cmdName).run(message, args, userdata)
  }
  /**
   * @description Gets a command from the `FarmBotCommandHandler`.
   * @param {String} cmd - The command name.
   * @returns {(FarmBotCommand | undefined)} The found command, or undefined if no command is found.
   */
  get(cmd) {
    return super.get(cmd) || super.get(this.aliases.get(cmd))
  }

  /**
   * @description Adds a command to the bot.
   * @param {String} name - The command name.
   * @param {CommandFunction} func - The command function.
   * @param {CommandInformation} info - The information for the command.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   * @returns {FarmBotCommand} The new `FarmBotCommand` object.
   */
  set(name, func, info, parent) {
    const newCmd = new FarmBotCommand(name, func, info, parent ? parent : null)
    if (info && info.aliases) {
      info.aliases.forEach((alias) => {
        this.aliases.set(alias, name)
      })
    }
    super.set(name, newCmd)
    return newCmd
  }

  /**
   * @description Checks if a command is in the `FarmBotCommandHandler`.
   * @param {String} cmd - The command to check for.
   * @returns {Boolean} Whether or not the command is in the `FarmBotCommandHandler`.
   */
  has(cmd) {
    return super.has(cmd) || this.aliases.has(cmd)
  }

  /**
   * @description Gets the help embed for the command.
   * @param {String[]} args - The name of the command to get the help embed for.
   * @param {import("./user.js").User} userdata - The user's DB information.
   * @returns {(import("./classes.js").Embed | undefined)} The help embed for this command, or `undefined` if their permmissions aren't high enough or there is no command with that name.
   */
  getEmbed(args, userdata) {
    console.log(args)
    return this.has(args[0]) ? this.get(args.shift()).getEmbed(args, userdata) : undefined
  }

  // [util.inspect.custom]() {
  //   return util.inspect(this).replace(" [Map] ", " ")
  //   // const SPACER = depth.toString()
  //   // let toReturn = ""
  //   // for (const [name, cmd] of this.entries()) {
  //   //   toReturn += `\n${SPACER.repeat(depth - 2)}${name} => ${util.inspect(cmd, true, depth + 1, true)},`
  //   // }
  //   // return `${customclass(this.constructor.name)}(${this.size}): {${toReturn.slice(0, -1)}${this.size == 0 ? "" : "\n" + SPACER.repeat(depth - 1)}}`
  // }

  /**
   * @description Ye.
   * @returns {IterableIterator<[string, FarmBotCommand]>} The iterable.
   */
  entries() {
    return super.entries()
  }
}

module.exports = {
  FarmBotCommandHandler,
  CommandInformation
}