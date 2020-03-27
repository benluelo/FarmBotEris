import * as util from "util"
import { readFileSync } from "fs"
import { resolve } from "path"
import type { CropInfo } from "./crop-data"

export class Embed {
  /**
   * @description Creates a new Embed.
   */
  constructor(private embed: {
    /** The title of the embed. */
    title?: string,
    /** The description of the embed. */
    description?: string,
    /** The url of the embed. */
    url?: string,
    /** The color of the embed. */
    color?: number,
    /** The timestamp of the embed. */
    timestamp?: string,
    /** The footer of the embed. */
    footer?: {
      /** The footer icon. */
      icon_url?: string,
      /** The footer text. */
      text?: string,
    },
    /** The embed thumbnail. */
    thumbnail?: {
      /** The url of the thumbnail. */
      url?: string,
    },
    /** The embed image. */
    image?: {
      /** The url of the image. */
      url?: string,
    },
    /** The author of the embed. */
    author?: {
      /** The author's name. */
      name?: string,
      /** The url of the author's image. */
      url?: string,
      /** The url of the author's icon. */
      icon_url?: string,
    },
    /** The fields of the embed. */
    fields?: {
      /** The name of the field. */
      name: string,
      /** The content of the field. */
      value: string,
      /** Whether or not the field is inline. */
      inline?: boolean,
    }[]
  } = {
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
    fields: null
  }) {}

  // #region Embed methods

  /**
   * @description Sets the title of the embed.
   * @param title - Title of embed.
   * @returns The embed this was called on.
   */
  setTitle(title: string = null): this {
    this.embed.title = title
    return this
  }

  /**
   * @description Sets the description of the embed.
   * @param description - Description of embed.
   * @returns The embed this was called on.
   */
  setDescription(description: string = null): this {
    this.embed.description = description
    return this
  }

  /**
   * @description Sets the url of the embed.
   * @param url - URL for the embed.
   * @returns The embed this was called on.
   */
  setUrl(url: (string | URL | Attachment) = null): this {
    this.embed.url = this.getURL(url)
    return this
  }

  /**
   * @description Sets the color of the embed.
   * @param color - Hexadecimal numeric hex color code.
   * @returns The embed this was called on.
   */
  setColor(color: number = null): this {
    this.embed.color = color
    return this
  }

  /**
   * @description Sets the timestamp of the embed to the moment at which it is called.
   * @returns The embed this was called on.
   */
  setTimestamp(): this {
    this.embed.timestamp = new Date().toISOString()
    return this
  }

  /**
   * @description Sets the footer of the embed.
   * @param text - Text of the footer.
   * @param icon_url - URL icon for the footer.
   * @returns The embed this was called on.
   */
  setFooter(text: string = null, icon_url: (string | URL | Attachment) = null): this {
    this.embed.footer.text = text
    this.embed.footer.icon_url = this.getURL(icon_url)
    return this
  }

  /**
   * @description Sets the url of the embed.
   * @param url - URL of the thumbnail.
   * @returns The embed this was called on.
   */
  setThumbnail(url: (string | URL | Attachment) = null): this {
    this.embed.thumbnail.url = this.getURL(url)
    return this
  }

  /**
   * @description Sets the author of the embed.
   * @param name - Name of the author.
   * @param url - URL of the author title.
   * @param icon_url - URL to the author icon.
   * @returns The embed this was called on.
   */
  setAuthor(name: string = null, url: (string | URL | Attachment) = null, icon_url: (string | URL | Attachment) = null): this {
    this.embed.author.name = name
    this.embed.author.url = this.getURL(url)
    this.embed.author.icon_url = this.getURL(icon_url)
    return this
  }

  /**
   * @description Adds a field to the embed. `name` and `value` are required.
   * @param name - Title of the field.
   * @param value - Value of the field.
   * @param inline - Whether or not the field should be inline.
   * @returns The embed this was called on.
   */
  addField(name: string, value: string, inline: boolean = false): this {
    this.embed.fields.push({
      name: name,
      value: value,
      inline: inline
    })
    return this
  }

  /**
   * @description Adds a blank field to the embed.
   * @param inline - Whether or not the field should be inline.
   * @returns The embed this was called on.
   */
  addBlankField(inline: boolean = false): this {
    this.embed.fields.push({
      name: "\u200B",
      value: "\u200B",
      inline: inline
    })
    return this
  }

  /**
   * @description Sends a pre-formatted uh-oh message.
   * @param message - The uh-oh message to send to the user.
   * @returns The embed this was called on.
   */
  uhoh(message: string = ""): this {
    this.embed.title = "Uh-oh!"
    this.embed.description = message
    this.embed.color = 0xFF0000
    return this
  }

  /**
   * @description Send a preset success message.
   * @param message - The message to show user.
   * @returns The embed this was called on.
   */
  success(message: string = ""): this {
    this.embed.description = message
    this.embed.color = 0x00FF00
    return this
  }

  /**
   * @description Gets the image url out of the provided object.
   * @param obj - The {@link URL}, {@link Attachment}, or String to get the image url from.
   * @returns The url for the image.
   */
  private getURL(obj: (URL | Attachment | string)): string {
    if (obj instanceof URL) { return obj.href }
    else if (obj instanceof Attachment) { return obj.link() }
    else { return obj }
  }

  [util.inspect.custom](depth: number, options: util.InspectOptionsStylized) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }

  // #endregion Embed methods
}
export class ProgressBar {
  /**
   * @description Creates a new Progressbar.
   * @param numerator - The numerator for the progress bar.
   * @param denominator - The denominator for the progress bar.
   * @param length - The length of the progress bar in characters.
   */
  constructor(protected numerator: number, protected denominator: number, protected length: number) {
    this.numerator = numerator
    this.denominator = denominator
    this.length = length
  }

  show(): string {
    const full = Math.floor((this.numerator / this.denominator) * this.length)
    const empty = Math.ceil(this.length - ((this.numerator / this.denominator) * this.length))
    return "█".repeat(full) + "░".repeat(empty)
  }

  [util.inspect.custom](depth: number, options: util.InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }
}
export class XPProgressBar extends ProgressBar {
  private _level: number
  /**
   * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
   * @param exp - The amount of experience points. Must be `>= 0`.
   * @param length=10 - The length of the progress bar, in characters. Default is 10. Must be `>= 2`.
   * @param base=2 - The base for the level calculation. Must be `>= 2`.
   */
  constructor(exp: number, length: number = 10, base: number = 2) {
    const { getLevel } = require("../../helpers/level-test.js")
    const data = getLevel(base, exp)
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

  [util.inspect.custom](depth: number, options: util.InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }
}
export class Attachment {
  file: Buffer
  fileName: string
  constructor(private crop: CropInfo.CropName, private size: number = 150) {
    this.file = readFileSync(resolve(`./bot/images/png/${crop}.png`))
    this.fileName = `${crop}.png`
  }

  send() {
    return {
      file: this.file,
      name: this.fileName
    }
  }

  link() {
    return `attachment://${this.fileName}`
  }

  [util.inspect.custom](depth: number, options: util.InspectOptionsStylized) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }
}