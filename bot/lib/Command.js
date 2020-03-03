const util = require("util")

class FarmBotCommand {
  /**
   * @description Makes a command for the bot.
   * @param {String} name - The name of the command.
   * @param {function(): void} func - The command.
   * @param {FarmBotCommand} [parent] - The parent command, if this is a subcommand.
   */
  constructor(name, func, parent) {
    this.name = name
    this.parent = parent
    console.log("Parent:", parent)
  }

  run(message, args) {
    return this.func(message, args)
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param {String} name - The name of the subcommand.
   * @param {function(): void} func - The subcommand
   */
  subcommand(name, func) {
    console.log("this:", this)
    return new FarmBotCommand(name, func, this)
  }

  [util.inspect.custom](depth, options) {
    // get parents 
    const parents = 0
    if (depth) {
      if (this.parent) {
        return options.stylize(`[Subcommand => ${util.inspect(this.parent, true, 0, true)}${this.name}]`, "special")
      }
      return options.stylize(`[Command => ${this.name}]`, "special")
    } else if (depth == 0) {
      return (this.parent? util.inspect(this.parent, true, 0, true) : "") + this.name + "."
    }
  }
}

console.log(
  new FarmBotCommand("test", function (){})
  .subcommand("sub1", function (){})
  .subcommand("sub2", function (){})
  .subcommand("sub3", function (){})
  .subcommand("sub4", function (){})
)

module.exports = FarmBotCommand