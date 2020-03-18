const util = require("util")
// const chalk = require("chalk")
// const customclass = chalk.keyword("orange")
// const userid = chalk.keyword("purple")

// const G = require("../../global.ts")

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

/** @type {Embed} */
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
  constructor(embed = {}) {
    this.embed = {
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
    }

    this.embed = {
      embed,
      ...this.embed
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

  [util.inspect.custom](depth, options) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
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

  [util.inspect.custom](depth, options) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
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

  [util.inspect.custom](depth, options) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
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

  [util.inspect.custom](depth, options) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }
}

module.exports = {
  Embed,
  ProgressBar,
  XPProgressBar,
  Attachment
}

// eslint-disable-next-line no-unused-vars
const logx = (base, num) => {
  return Math.log(num) / Math.log(base)
}