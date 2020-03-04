const util = require("util")
const chalk = require("chalk")
const customclass = chalk.keyword("orange")
const userid = chalk.keyword("purple")
const FarmBotCommand = require("./FarmBotCommand.js")

class FarmBotCommandHandler extends Map {
  constructor() {
    super()
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
   * @description Adds a user to the `Cooldowns`.
   * @param {FarmBotCommand} cmd - The command to add to the command handler.
   * @returns {this} The `FarmBotCommandHandler` object.
   */
  set(cmd) {
    return super.set(cmd.name, new FarmBotCommand*)
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
}

module.exports = FarmBotCommandHandler