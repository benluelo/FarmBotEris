const util = require("util")
const chalk = require("chalk")
const customclass = chalk.keyword("orange")
const userid = chalk.keyword("purple")
const COMMAND_OBJECTS = require("./help-info.js").commands
// const SPACER = "->"

/**
 * @module FarmBot
 */
/**
 * @typedef {function(import("eris").Message, String[]): void} CommandFunction
 */

class FarmBotCommand {
  /**
   * @description Makes a command for the bot.
   * @param {String} name - The name of the command.
   * @param {CommandFunction} func - The command.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   */
  constructor(name, func, parent) {
    this.name = name
    this.func = Object.defineProperty(func, "name", {
      value: name,
      writable: false
    })
    this.parent = parent
    this.subcommands = new FarmBotCommandHandler()
    const temp = (
      /**
       * @description Ye.
       * @param {String[]} cmdArray - The command name(s).
       * @param {import("./help-info.js").CommandHelpObject} cd - The help object for the command.
       * @returns {import("./help-info.js").CommandHelpObject} The found help object, or undefined if no object is found.
       */
      function getCommandObject(cmdArray, cd) {
        const cmd = cmdArray[0]
        if (cmdArray.length > 1 ) {
          cmdArray.shift()
          if (!cd[cmd]) { return console.warn(`Command ${chalk.red.bold(cmd)} does not have a corresponding help object.`) }
          return getCommandObject(cmdArray, cd[cmd].subcommands)
        } else {
          if (!cd[cmd]) { return console.warn(`Command ${chalk.red.bold(cmd)} does not have a corresponding help object.`) }
          return cd[cmd]
        }
      })(this.getFullCommandName().split(" "), COMMAND_OBJECTS)
    this.cooldown = temp ? temp.cooldown || 0 : null
    this.permissionLevel = temp ? temp.permissionLevel || 0 : null
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
      if (userdata.permissions < this.permissionLevel) { return }
      this.subcommands.get(args.shift()).run(msg, args)
    } else {
      const TTW = msg._client.Cooldowns.check(msg.author.id, this.getFullCommandName())
      if (TTW > 0) {
        msg.send(`**${msg.author.username}**, you have to wait ${(TTW / 1000).toFixed(2)} seconds to use \`farm ${this.getFullCommandName()}\`!`)
      } else {
        this.func(msg, args, userdata)
      }
    }
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param {String} name - The name of the subcommand.
   * @param {CommandFunction} func - The subcommand.
   * @returns {FarmBotCommand} The new subcommand object.
   */
  subcommand(name, func) {
    return this.subcommands.set(name, func, this)
  }

  [util.inspect.custom](depth, options) {
    // const SPACER = depth.toString()
    // switch (depth) {
    //   case (0): {
    //     return options.stylize(`[${this.constructor.name}: ${this.getFullCommandName()}]`, "special")
    //   }
    //   default: {
    //     return `{\n${SPACER.repeat(depth)}name: ${this.name},\n${SPACER.repeat(depth)}cooldown: ${this.cooldown},\n${SPACER.repeat(depth)}subcommands: ${util.inspect(this.subcommands, true, depth + 1, true)}\n${SPACER.repeat(depth - 1)}}`
    //   }
    // }
    const toReturn = {
      name: this.name,
      cooldown: this.cooldown,
      permissionLevel: this.permissionLevel
    }
    this.parent ? toReturn.parent = this.parent.name : null,
    this.subcommands.size > 0 ? toReturn.subcommands = this.subcommands : null
    return util.inspect(toReturn, true, depth, true)
  }
}

class FarmBotCommandHandler extends Map {
  constructor() {
    super()
  }

  /**
   * @description Runs thespecified command.
   * @param {String} cmdName - The name of the command to run.
   * @param {import("eris").Message} message - The message that was sent.
   * @param {String[]} args - The command arguments.
   * @param {import("./user.js").User} userdata - The user's DB information.
   */
  run(cmdName, message, args, userdata) {
    // console.log(cmdName, this.get(cmdName))
    this.get(cmdName).run(message, args, userdata)
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

  // [util.inspect.custom](depth = 0, options) {
  //   const SPACER = depth.toString()
  //   let toReturn = ""
  //   for (const [name, cmd] of this.entries()) {
  //     toReturn += `\n${SPACER.repeat(depth - 2)}${name} => ${util.inspect(cmd, true, depth + 1, true)},`
  //   }
  //   return `${customclass(this.constructor.name)}(${this.size}): {${toReturn.slice(0, -1)}${this.size == 0 ? "" : "\n" + SPACER.repeat(depth - 1)}}`
  // }

  /**
   * @description Ye.
   * @returns {IterableIterator<[string, FarmBotCommand]>} The iterable.
   */
  entries() {
    return super.entries()
  }
}

module.exports = FarmBotCommandHandler