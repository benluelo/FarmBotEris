const util = require("util")
const chalk = require("chalk")
const customclass = chalk.keyword("orange")
const userid = chalk.keyword("purple")

class Cooldowns extends Map {
  constructor() {
    super()
    /** @type {Object<string, number>} */
    this.COMMAND_COOLDOWNS = {}
    const allCommands = require("./help-info.js").commands
    for (const command in allCommands) {
      const current = allCommands[command]

          ;(/**
             * @description Ye.
             * @param {String} cmdName - The name of the command.
             * @param {import("./help-info.js").CommandHelpObject} cmdObject - The object of the command.
             * @param {String} [parent] - The parent command if this is a subcommand.
             * @param {this} thisArg - The parent command if this is a subcommand.
             */
        function getCooldowns(cmdName, cmdObject, parent, thisArg) {
          if (cmdObject.subcommands) {
            const subs = Object.keys(cmdObject.subcommands)
            subs.forEach((sc) => {
              getCooldowns(cmdName + " " + sc, cmdObject.subcommands[sc], cmdName, thisArg)
            })
          }
          thisArg.COMMAND_COOLDOWNS[cmdName] = cmdObject.cooldown
        }
      )(command, current, false, this)
    }
    console.log(this.COMMAND_COOLDOWNS)
  }

  /**
   * @description Checks if a user is able to use a command. If they are able to use it, reset their cooldown for that command.
   * @param {String} userID - The `userID` of the user who is attempting to use the command.
   * @param {String} commandName - The name of the command the user is attempting to use.
   * @returns {Number} How long the user has to wait to use the command, in milliseconds; `0` if the cooldown is up.
   */
  check(userID, commandName) {

    // check for the user in the cooldowns
    if (this.has(userID)) {
      /** @description The **T**ime the user has **T**o **W**ait to use the command. */
      let TTW = 0
      // if the user is in the cooldowns, check if they can use the command
      if ((TTW = this.get(userID).get(commandName)) == 0) {
        // if they can use the command, reset their cooldown for that command
        this.get(userID).set(commandName, Date.now())
        return 0
      } else {
        // else, return how long they have to wait
        return TTW
      }
      // if the user isn't in the cooldowns, add them to it
    } else {
      this.set(userID, commandName)
      return 0
    }
  }

  /**
   * @description Gets a user from the `Cooldowns`.
   * @param {String} userID - The user's `userID` to get from the `Cooldowns`.
   * @returns {(UserCoolDowns | undefined)} The found user, or `undefined` if they weren't found.
   */
  get(userID) {
    return super.get(userID)
  }

  /**
   * @description Adds a user to the `Cooldowns`.
   * @param {String} userID - The user's `userID` to add to the `Cooldowns`.
   * @param {String} cmd - The command that the user called first to set the cooldown of when adding their `UserCoolDowns` object to the `Cooldowns` Map.
   * @returns {this} The `Cooldowns` object.
   */
  set(userID, cmd) {
    return super.set(userID, new UserCoolDowns(this.COMMAND_COOLDOWNS, cmd))
  }

  /**
   * @description Checks if a user is in the `Cooldowns`.
   * @param {String} userID - The user's `userID` to check the `Cooldowns` for.
   * @returns {Boolean} Whether or not the user is in the `Cooldowns`.
   */
  has(userID) {
    return super.has(userID)
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

class UserCoolDowns extends Map {
  /**
   * @description Creates a new `UserCoolDown` object for use in the `Cooldowns`.
   * @param {Object<string, number>} COMMAND_NAMES - An object mapping all of the command names to their respective cooldowns.
   * @param {String} firstCommand - The command that was called, to set the cooldown of.
   */
  constructor(COMMAND_NAMES, firstCommand) {
    super()

    for (const cmd in COMMAND_NAMES) {
      this.set(cmd, 0)
    }
    this.set(firstCommand, Date.now())
    this.cooldownTimes = COMMAND_NAMES
  }

  /**
   * @description Checks if a user can use a command.
   * @param {String} cmd - The command name.
   * @returns {Number} How long the user has to wait to use the command; `0` if the cooldown is up.
   */
  get(cmd) {
    const t = super.get(cmd)
    const cd = this.cooldownTimes[cmd]
    return this._clamp((t + cd - Date.now()), 0, cd)
  }

  /**
   * @description Clamps a number between two provided values.
   * @param {Number} num - The number to clamp.
   * @param {Number} min - The minimum value for the number.
   * @param {Number} max - The maximum value for the number.
   * @returns {Number} The clamped number.
   */
  _clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
  }

  /* eslint-disable */
    /**
     * @param {Number} depth
     * @param {import("util").InspectOptionsStylized} options
     */
    [util.inspect.custom](depth, options) {
      if (depth == 0) {
        /** commands that are on cooldown */
        let hot = 0
        /** commands that are cooled down */
        let cold = 0
        /* eslint-enable */
      for (const [cmd] of this) {
        const t = this.get(cmd)
        t == 0 ? cold++ : hot++
      }
      return `${customclass(this.constructor.name)}: (Cold -> ${chalk.blue(cold)}, Hot -> ${chalk.red(hot)})`
    } else {
      let toReturn = ""
      for (const [cmd, timer] of this.entries()) {
        toReturn += `\n  ${options.stylize(cmd, "string")} => ${options.stylize(timer, this.get(cmd) == 0 ? "special" : "regexp")},`
      }
      return `${customclass(this.constructor.name)}(${this.size}): {${toReturn.slice(0, -1)}\n}`
    }
  }
}

module.exports = Cooldowns