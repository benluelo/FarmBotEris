class Embed {
  constructor() {
    this.self = {
      content: null,
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

  setTitle(title=null){
    this.self.embed.title = title
    return this
  }

  setDescription(description=null){
    this.self.embed.description = description
    return this
  }

  setUrl(url=null){
    this.self.embed.url = url
    return this
  }

  setColor(color=null){
    this.self.embed.color = color
    return this
  }

  setTimestamp(timestamp=null){
    this.self.embed.timestamp = timestamp
    return this
  }

  setFooter(text=null, icon_url=null){
    this.self.embed.footer.text = text
    this.self.embed.footer.icon_url = icon_url
    return this
  }

  setThumbnail(url=null){
    this.self.embed.thumbnail.url = url
    return this
  }

  setAuthor(name=null, url=null, icon_url=null){
    this.self.embed.author.name = name
    this.self.embed.author.url = url
    this.self.embed.author.icon_url = icon_url
    return this
  }

  addField(name=null, value=null, inline=false){
    this.self.embed.fields.push({
      name: name,
      value: value,
      inline: inline
    })
    return this
  }

  show(){
    return this.self
  }
}

module.exports = {
  Embed
}