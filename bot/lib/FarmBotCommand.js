const util = require("util")

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
    /** @type {Map<string, FarmBotCommand>} */
    this.subcommands = new Map()
  }

  getFullCommandName() {
    return (this.parent ? this.parent.getFullCommandName() + " " : "" ) + this.name
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param {String} name - The name of the subcommand.
   * @param {function(): void} func - The subcommand.
   * @returns {FarmBotCommand} The new subcommand object.
   */
  subcommand(name, func) {
    const subCmd = new FarmBotCommand(name, func, this)
    this.subcommands.set(name, subCmd)
    return subCmd
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

// console.log(
//   new FarmBotCommand("test", function () {})
//     .subcommand("sub1", function () {})
//     .subcommand("sub2", function () {})
//     .subcommand("sub3", function () {})
//     .subcommand("sub4", function () {})
// )

module.exports = FarmBotCommand