class Embed {
  /**
   * Creates a new ***Empty*** Embed.
   */
  constructor() {
    this.self = {
      embed: {
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
  }

  /**
   * Sets the title of the embed.
   * @param {String} title Title of embed
   */
  setTitle(title=null){
    this.self.embed.title = title
    return this
  }

  /**
   * Sets the description of the embed.
   * @param {String} description Description of embed
   */
  setDescription(description=null){
    this.self.embed.description = description
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL)} url URL for the embed
   */
  setUrl(url=null){
    this.self.embed.url = url instanceof URL? url.href: url
    return this
  }

  /**
   * Sets the color of the embed.
   * @param {Number} color Hexadecimal numeric hex color code
   */
  setColor(color=null){
    this.self.embed.color = color
    return this
  }

  /**
   * Sets the timestamp of the embed to the moment at which it is called.
   */
  setTimestamp(){
    this.self.embed.timestamp = new Date().toISOString()
    return this
  }

  /**
   * Sets the footer of the embed.
   * @param {String} text Text of the footer
   * @param {(String | URL)} icon_url URL icon for the footer
   */
  setFooter(text=null, icon_url=null){
    this.self.embed.footer.text = text
    this.self.embed.footer.icon_url = icon_url instanceof URL? icon_url.href: icon_url
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL)} url URL of the thumbnail
   */
  setThumbnail(url=null){
    this.self.embed.thumbnail.url = url instanceof URL? url.href: url
    return this
  }

  /**
   * Sets the author of the embed.
   * @param {String} name Name of the author
   * @param {(String | URL)} url URL of the author title
   * @param {(String | URL)} icon_url URL to the author icon
   */
  setAuthor(name=null, url=null, icon_url=null){
    this.self.embed.author.name = name
    this.self.embed.author.url = url instanceof URL? url.href: url
    this.self.embed.author.icon_url = icon_url instanceof URL? icon_url.href: icon_url
    return this
  }

  /**
   * Adds a field to the embed. `name` and `value` are required.
   * @param {String} name Title of the field
   * @param {String} value Value of the field
   * @param {Boolean} inline Whether or not the field should be inline
   */
  addField(name, value, inline=false){
    this.self.embed.fields.push({
      name: name,
      value: value,
      inline: inline
    })
    return this
  }

  /**
   * Adds a blank field to the embed
   * @param {Boolean} inline Whatever or not the field should be inline
   */
  addBlankField(inline=false) {
    this.self.embed.fields.push({
      name: "\u200B",
      value: "\u200B",
      inline: inline
    })
    return this
  }

  /**
   * Returns an embed object literal for use in sending in messages.s
   * @returns Eris embed object
   */
  show(){
    return this.self
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
  constructor(exp, length=10){
    const getLevel = (exp) => { return Math.log2(exp + 1) }
    console.log(exp, Math.pow(2, Math.trunc(getLevel(exp))))
    const numerator = exp + 1 - Math.pow(2, Math.trunc(getLevel(exp)))
    const denominator = Math.pow(2, Math.trunc(getLevel(exp)))
    super(numerator, denominator, length)
  }

  show() {
    return `**${this.numerator}/${this.denominator}**xp\n` + super.show()
  }
}

module.exports = {
  Embed,
  ProgressBar,
  XPProgressBar
}