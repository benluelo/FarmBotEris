const util = require("util")
// console.log(util.inspect.styles)
util.inspect.styles.customclass = "yellowBright"
// util.inspect.styles.userID = 
const chalk = require("chalk")
const customclass = chalk.keyword("orange")
const userid = chalk.keyword("purple")
// console.log(util.inspect.styles)

/**
 * @namespace Classes
 */

/**
 * @description Gets the image url out of the provided object.
 * @param {(URL | Attachment | String)} obj - The {@link URL}, {@link Attachment}, or String to get the image url from.
 * @returns {String} The url for the image.
 */
function getURL(obj) {
  if (obj instanceof URL) { return obj.href }
  else if (obj instanceof Attachment) { return obj.link() }
  else { return obj }
}

class Embed {
  /**
   * @description Creates a new Embed.
   * @param {Object} [embed] - The embed.
   * @param {String} [embed.title] - The title of the embed.
   * @param {String} [embed.description] - The description of the embed.
   * @param {(String | URL | Attachment)} [embed.url] - The url of the embed.
   * @param {Number} [embed.color] - The color of the embed.
   * @param {String} [embed.timestamp] - The timestamp of the embed.
   * @param {Object} [embed.footer] - The footer of the embed.
   * @param {(String | URL | Attachment)} [embed.footer.icon_url] - The footer icon.
   * @param {String} [embed.footer.text] - The footer text.
   * @param {Object} [embed.thumbnail] - The embed thumbnail.
   * @param {(String | URL | Attachment)} [embed.thumbnail.url] - The url of the thumbnail.
   * @param {Object} [embed.image] - The embed image.
   * @param {(String | URL | Attachment)} [embed.image.url] - The url of the image.
   * @param {Object} [embed.author] - The author of the embed.
   * @param {String} [embed.author.name] - The name of the author.
   * @param {(String | URL | Attachment)} [embed.author.url] - The url of the author's image.
   * @param {(String | URL | Attachment)} [embed.author.icon_url] - The url of the author's icon.
   * @param {Object[]} [embed.fields] - The fields of the embed.
   * @param {String} [embed.fields.name] - The name of the field.
   * @param {String} [embed.fields.value] - The content of the field.
   */
  constructor(embed = {
    title: null,
    description: null,
    url: null,
    color: null,
    timestamp: null,
    footer: {
      icon_url: null,
      text: null
    },
    thumbnail: {
      url: null
    },
    image: {
      url: null
    },
    author: {
      name: null,
      url: null,
      icon_url: null
    },
    fields: []
  }) {
    this.embed = {
      ...embed
    }
  }

  // #region Embed methods

  /**
   * @description Sets the title of the embed.
   * @param {String} title - Title of embed.
   * @returns {Embed} The embed this was called on.
   */
  setTitle(title = null) {
    this.embed.title = title
    return this
  }

  /**
   * @description Sets the description of the embed.
   * @param {String} description - Description of embed.
   * @returns {Embed} The embed this was called on.
   */
  setDescription(description = null) {
    this.embed.description = description
    return this
  }

  /**
   * @description Sets the url of the embed.
   * @param {(String | URL | Attachment)} url - URL for the embed.
   * @returns {Embed} The embed this was called on.
   */
  setUrl(url = null) {
    this.embed.url = getURL(url)
    return this
  }

  /**
   * @description Sets the color of the embed.
   * @param {Number} color - Hexadecimal numeric hex color code.
   * @returns {Embed} The embed this was called on.
   */
  setColor(color = null) {
    this.embed.color = color
    return this
  }

  /**
   * @description Sets the timestamp of the embed to the moment at which it is called.
   * @returns {Embed} The embed this was called on.
   */
  setTimestamp() {
    this.embed.timestamp = new Date().toISOString()
    return this
  }

  /**
   * @description Sets the footer of the embed.
   * @param {String} text - Text of the footer.
   * @param {(String | URL | Attachment)} icon_url - URL icon for the footer.
   * @returns {Embed} The embed this was called on.
   */
  setFooter(text = null, icon_url = null) {
    this.embed.footer.text = text
    this.embed.footer.icon_url = getURL(icon_url)
    return this
  }

  /**
   * @description Sets the url of the embed.
   * @param {(String | URL | Attachment)} url - URL of the thumbnail.
   * @returns {Embed} The embed this was called on.
   */
  setThumbnail(url = null) {
    this.embed.thumbnail.url = getURL(url)
    return this
  }

  /**
   * @description Sets the author of the embed.
   * @param {String} name - Name of the author.
   * @param {(String | URL | Attachment)} url - URL of the author title.
   * @param {(String | URL | Attachment)} icon_url - URL to the author icon.
   * @returns {Embed} The embed this was called on.
   */
  setAuthor(name = null, url = null, icon_url = null) {
    this.embed.author.name = name
    this.embed.author.url = getURL(url)
    this.embed.author.icon_url = getURL(icon_url)
    return this
  }

  /**
   * @description Adds a field to the embed. `name` and `value` are required.
   * @param {String} name - Title of the field.
   * @param {String} value - Value of the field.
   * @param {Boolean} inline - Whether or not the field should be inline.
   * @returns {Embed} The embed this was called on.
   */
  addField(name, value, inline = false) {
    this.embed.fields.push({
      name: name,
      value: value,
      inline: inline
    })
    return this
  }

  /**
   * @description Adds a blank field to the embed.
   * @param {Boolean} inline - Whether or not the field should be inline.
   * @returns {Embed} The embed this was called on.
   */
  addBlankField(inline = false) {
    this.embed.fields.push({
      name: "\u200B",
      value: "\u200B",
      inline: inline
    })
    return this
  }

  /**
   * @description Sends a pre-formatted uh-oh message.
   * @param {String} message - The uh-oh message to send to the user.
   * @returns {Embed} The embed this was called on.
   */
  uhoh(message = "") {
    this.embed.title = "Uh-oh!"
    this.embed.description = message
    this.embed.color = 0xFF0000
    return this
  }

  /**
   * @description Send a preset success message.
   * @param {String} message - The message to show user.
   * @returns {Embed} The embed this was called on.
   */
  success(message = "") {
    this.embed.description = message
    this.embed.color = 0x00FF00
    return this
  }

  showContent() {
    return this.embed
  }

  // #endregion Embed methods
}
class ProgressBar {
  /**
   * @description Creates a new Progressbar.
   * @param {Number} numerator - The numerator for the progress bar.
   * @param {Number} denominator - The denominator for the progress bar.
   * @param {Number} length - The length of the progress bar in characters.
   */
  constructor(numerator, denominator, length) {
    this.numerator = numerator
    this.denominator = denominator
    this.length = length
  }

  show() {
    const full = Math.floor((this.numerator / this.denominator) * this.length)
    const empty = Math.ceil(this.length - ((this.numerator / this.denominator) * this.length))
    return "█".repeat(full) + "░".repeat(empty)
  }
}

class XPProgressBar extends ProgressBar {
  /**
   * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
   * @param {Number} exp - The amount of experience points. Must be `>= 0`.
   * @param {Number} [length=10] - The length of the progress bar, in characters. Default is 10. Must be `>= 2`.
   * @param {Number} [base=2] - The base for the level calculation. Must be `>= 2`.
   */
  constructor(exp, length = 10, base = 2) {
    const { getLevel } = require("../../helpers/level-test.js")
    // console.log(`base: ${base}, exp: ${exp}`)
    const data = getLevel(base, exp)
    // console.log("data:", data)
    // console.log(exp, temp)
    const numerator = data.numerator
    const denominator = data.denominator
    super(numerator, denominator, length)
    this._level = data.level
  }

  show() {
    return `**${this.numerator}/${this.denominator}**xp\n` + super.show()
  }

  level() {
    return this._level
  }
}

const { readFileSync } = require("fs")
class Attachment {
  constructor(crop, size = 150) {
    this.crop = crop
    this.size = size
    this.file = readFileSync(require("path").resolve(`./bot/images/png/${crop}.png`))
    this.name = `${crop}.png`
  }

  send() {
    return {
      file: this.file,
      name: this.name
    }
  }

  link() {
    return `attachment://${this.name}`
  }
}

class Cooldowns extends Map {
  constructor() {
    super()
    /** @type {Object<string, number>} */
    this.COMMAND_COOLDOWNS = {} 
    const allCommands = require("./help-info.js").commands
    for (const command in allCommands) {

      for (const command in allCommands) {
        const current = allCommands[command]
      
        ;(/**
           * @description Ye.
           * @param {String} cmdName - The name of the command.
           * @param {import("./help-info.js").CommandHelpObject} cmdObject - The object of the command.
           * @param {String} [parent] - The parent command if this is a subcommand.
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
      // console.log(JSON.stringify(, null, 4))
      // console.log(options.stylize)
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

module.exports = {
  Embed,
  ProgressBar,
  XPProgressBar,
  Attachment,
  Cooldowns
}

// eslint-disable-next-line no-unused-vars
const logx = (base, num) => {
  return Math.log(num) / Math.log(base)
}