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
   * @param {String} title
   */
  setTitle(title=null){
    this.self.embed.title = title
    return this
  }

  /**
   * Sets the description of the embed.
   * @param {String} description
   */
  setDescription(description=null){
    this.self.embed.description = description
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL)} url
   */
  setUrl(url=null){
    this.self.embed.url = url instanceof URL? url.href: url
    return this
  }

  /**
   * Sets the color of the embed.
   * @param {Number} color
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
   * @param {String} text
   * @param {(String | URL)} icon_url
   */
  setFooter(text=null, icon_url=null){
    this.self.embed.footer.text = text
    this.self.embed.footer.icon_url = icon_url instanceof URL? icon_url.href: icon_url
    return this
  }

  /**
   * Sets the url of the embed.
   * @param {(String | URL)} url
   */
  setThumbnail(url=null){
    this.self.embed.thumbnail.url = url instanceof URL? url.href: url
    return this
  }

  /**
   * Sets the author of the embed.
   * @param {String} name
   * @param {(String | URL)} url
   * @param {(String | URL)} icon_url
   */
  setAuthor(name=null, url=null, icon_url=null){
    this.self.embed.author.name = name
    this.self.embed.author.url = url instanceof URL? url.href: url
    this.self.embed.author.icon_url = icon_url instanceof URL? icon_url.href: icon_url
    return this
  }

  /**
   * Adds a field to the embed. `name` and `value` are required.
   * @param {String} name
   * @param {String} value
   * @param {Boolean} inline
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
   * Returns an embed object literal for use in sending in messages.s
   */
  show(){
    return this.self
  }
}

module.exports = {
  Embed: Embed
}