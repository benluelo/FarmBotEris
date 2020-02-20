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
   * Creates a new ***Empty*** Embed.
   */
  constructor() {
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
  }

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
    console.log("num:", this.numerator, "den:", this.denominator)
    console.log("full:", full, "empty:", empty)
    return "█".repeat(full) + "░".repeat(empty)
  }
}

class XPProgressBar extends ProgressBar {
  constructor(exp, length=10, base=2){
    const { getLevel } = require("../../helpers/level-test.js")
    console.log(`base: ${base}, exp: ${exp}`)
    const data = getLevel(base, exp)
    console.log("data:", data)
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