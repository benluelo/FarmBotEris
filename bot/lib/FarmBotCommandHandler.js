const util = require("util")
const chalk = require("chalk")
const customclass = chalk.keyword("orange")
const userid = chalk.keyword("purple")

class FarmBotCommand {
  /**
   * @description Makes a command for the bot.
   * @param {String} name - The name of the command.
   * @param {function(import("eris").Message, String[]): void} func - The command.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   */
  constructor(name, func, parent) {
    this.name = name
    this.run = func
    this.parent = parent
    this.subcommands = new FarmBotCommandHandler()
  }

  getFullCommandName() {
    return (this.parent ? this.parent.getFullCommandName() + " " : "" ) + this.name
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param {String} name - The name of the subcommand.
   * @param {function(import("eris").Message, String[]): void} func - The subcommand.
   * @returns {FarmBotCommand} The new subcommand object.
   */
  subcommand(name, func) {
    return this.subcommands.set(name, func, this)
  }

  [util.inspect.custom](depth, options) {
    console.log(depth)
    switch (depth) {
      case (0): {
        return (this.parent ? util.inspect(this.parent, true, 0, true) : "") + this.name + "."
      }
      case (1): {
        if (this.parent) {
          return options.stylize(`[Subcommand => ${util.inspect(this.parent, true, 0, true)}${this.name}]`, "special")
        }
        return options.stylize(`[Command => ${this.name}]`, "special")
      }
      default: {
        let toReturn = ""
        if (this.subcommands.size > 0) {
          for (const [name, subCmd] of this.subcommands.entries()) {
            toReturn += `\n  ${name} => ${util.inspect(subCmd, true, 1, true)},`
          }
        }
        return util.inspect(this, true, 1, true) + (this.subcommands.size > 0 ? ` Subcommands(${this.subcommands.size}) {${toReturn}}` : "")
      }
    }
  }
}

class FarmBotCommandHandler extends Map {
  constructor() {
    super()
  }

  run(cmdName, message, args) {
    this.get(cmdName).run(message, args)
  }
  /**
   * @description Gets a command from the `FarmBotCommandHandler`.
   * @param {String} cmd - The command name.
   * @returns {(FarmBotCommand | undefined)} The found command, or undefined if no command is found.
   */
  get(cmd) {
    return super.get(cmd)
  }

  /**
   * @description Adds a command to the bot.
   * @param {String} name - The command name.
   * @param {function(import("eris").Message, String[]): void} func - The command function.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   * @returns {FarmBotCommand} The new `FarmBotCommand` object.
   */
  set(name, func, parent) {
    const newCmd = new FarmBotCommand(name, func, parent ? parent : null)
    super.set(name, newCmd)
    return newCmd
  }

  /**
   * @description Checks if a command is in the `FarmBotCommandHandler`.
   * @param {String} cmd - The command to check for.
   * @returns {Boolean} Whether or not the command is in the `FarmBotCommandHandler`.
   */
  has(cmd) {
    return super.has(cmd)
  }

  // eslint-disable-next-line jsdoc/require-description, jsdoc/require-returns, jsdoc/require-param-description, jsdoc/require-param-description
  /**
   * @param {Number} depth
   * @param {import("util").InspectOptionsStylized} options
   */
  [util.inspect.custom](depth, options) {
    let toReturn = ""
    for (const [userID, userCoolDown] of this.entries()) {
      toReturn += `\n  ${userid(userID)} => ${util.inspect(userCoolDown, true, 0, true)},`
    }
    return `${customclass(this.constructor.name)}(${this.size}): {${toReturn.slice(0, -1)}${this.size == 0 ? "" : "\n"}}`
  }

  /**
   * @description Ye.
   * @returns {IterableIterator<[string, FarmBotCommand]>} The iterable.
   */
  entries() {
    return super.entries()
  }
}

module.exports = FarmBotCommandHandler