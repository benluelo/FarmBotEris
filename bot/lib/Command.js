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
    console.log("Function:", this.func)
  }

  getFullCommandName() {
    return (this.parent ? this.parent.getFullCommandName() + " " : "" ) + this.name
  }

  [util.inspect.custom](depth, options) {
    if (depth) {
      if (this.parent) {
        return options.stylize(`[Subcommand => ${util.inspect(this.parent, true, 0, true)}${this.name}]`, "special")
      }
      return options.stylize(`[Command => ${this.name}]`, "special")
    } else if (depth == 0) {
      return (this.parent ? util.inspect(this.parent, true, 0, true) : "") + this.name + "."
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