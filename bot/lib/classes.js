function getURL(obj) {
  if (obj instanceof URL){
    return obj.href
  } else if (obj instanceof Attachment) {
    return obj.link()
  } else {
    return obj
  }
}

class Embed {
  /**
   * Creates a new Embed.
   * @param {Object} [embed]
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
  constructor(embed={
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
    this.embed =  embed
  }

  // #region Embed methods

  /**
   * Sets the title of the embed.
   * @param {String} title Title of embed
   */
  setTitle(title=null){
    this.embed.title = title
    return this
  }

  /**
   * Sets the description of the embed.
   * @param {String} description Description of embed
   */
  setDescription(description=null){
    this.embed.description = description
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL | Attachment)} url URL for the embed
   */
  setUrl(url=null){
    this.embed.url = getURL(url)
    return this
  }

  /**
   * Sets the color of the embed.
   * @param {Number} color Hexadecimal numeric hex color code
   */
  setColor(color=null){
    this.embed.color = color
    return this
  }

  /**
   * Sets the timestamp of the embed to the moment at which it is called.
   */
  setTimestamp(){
    this.embed.timestamp = new Date().toISOString()
    return this
  }

  /**
   * Sets the footer of the embed.
   * @param {String} text Text of the footer
   * @param {(String | URL | Attachment)} icon_url URL icon for the footer
   */
  setFooter(text=null, icon_url=null){
    this.embed.footer.text = text
    this.embed.footer.icon_url = getURL(icon_url)
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL | Attachment)} url URL of the thumbnail
   */
  setThumbnail(url=null){
    this.embed.thumbnail.url = getURL(url)
    return this
  }

  /**
   * Sets the author of the embed.
   * @param {String} name Name of the author
   * @param {(String | URL | Attachment)} url URL of the author title
   * @param {(String | URL | Attachment)} icon_url URL to the author icon
   */
  setAuthor(name=null, url=null, icon_url=null){
    this.embed.author.name = name
    this.embed.author.url = getURL(url)
    this.embed.author.icon_url = getURL(icon_url)
    return this
  }

  /**
   * Adds a field to the embed. `name` and `value` are required.
   * @param {String} name Title of the field
   * @param {String} value Value of the field
   * @param {Boolean} inline Whether or not the field should be inline
   */
  addField(name, value, inline=false){
    this.embed.fields.push({
      name: name,
      value: value,
      inline: inline
    })
    return this
  }

  /**
   * Adds a blank field to the embed
   * @param {Boolean} inline Whether or not the field should be inline
   */
  addBlankField(inline=false) {
    this.embed.fields.push({
      name: "\u200B",
      value: "\u200B",
      inline: inline
    })
    return this
  }

  showContent(){
    return this.embed
  }

  // #endregion Embed methods
}

class ProgressBar {
  /**
   * @param {Number} numerator
   * @param {Number} denominator
   * @param {Number} length - the length of the progress bar in characters.
   */
  constructor(numerator, denominator, length){
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
   *
   * @param {Number} exp - The emount of experience points. Must be `>= 0`.
   * @param {Number} [length=10] - The length of the progress bar, in characters. Default is 10. Must be `>= 2`.
   * @param {Number} [base=2] - The base for the level calculation. Must be `>= 2`.
   */
  constructor(exp, length=10, base=2){
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

  get level() {
    return this._level
  }
}

const { readFileSync } = require("fs")
class Attachment {
  constructor(crop, size=150) {
    this.crop = crop
    this.size = size
    this.file = readFileSync(`./bot/images/png/${crop}.png`)
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

module.exports = {
  Embed,
  ProgressBar,
  XPProgressBar,
  Attachment
}

const logx = (base, num) => {
  return Math.log(num)/Math.log(base)
}