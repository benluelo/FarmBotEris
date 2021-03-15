import { URL } from 'url';
import util from 'util';
import { Attachment } from './Attachment.js';

/**
 * @description Gets the image url out of the provided object.
 * @param obj - The {@link URL}, {@link Attachment}, or string to get the image url from.
 * @returns The url for the image.
 */
export function getURL(obj: UrlLike): string {
  if (obj instanceof URL) {
    return obj.href;
  } else if (obj instanceof Attachment) {
    return obj.link();
  } else {
    return obj;
  }
}

export type UrlLike = string | URL | Attachment;

type EmbedFields = {
  name: string;
  value: string;
  inline?: boolean;
};

type EmbedAuthor = {
  name: string;
  url: string | undefined;
  icon_url: string | undefined;
};

type EmbedImage = {
  url: string | undefined;
};

type EmbedThumbnail = {
  url: string | undefined;
};

type EmbedFooter = {
  icon_url: string | undefined;
  text: string;
};

type EmbedStructure = {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: EmbedFooter;
  thumbnail?: EmbedThumbnail;
  image?: EmbedImage;
  author?: EmbedAuthor;
  fields?: EmbedFields[];
};

export class Embed {
  embed: EmbedStructure = { fields: [] };

  constructor(embed?: EmbedStructure) {
    if (embed !== undefined) {
      this.embed = embed;
    }
  }

  // #region Embed methods
  /**
   * @description Sets the title of the embed.
   * @param title - Title of embed.
   * @returns The embed this was called on.
   */
  setTitle(title?: string): Embed {
    this.embed.title = title;
    return this;
  }

  /**
   * @description Sets the description of the embed.
   * @param description - Description of embed.
   * @returns The embed this was called on.
   */
  setDescription(description?: string): Embed {
    this.embed.description = description;
    return this;
  }

  /**
   * @description Sets the url of the embed.
   * @param url - URL for the embed.
   * @returns The embed this was called on.
   */
  setUrl(url?: UrlLike): Embed {
    if (url === undefined) {
      this.embed.url = undefined;
    } else {
      this.embed.url = getURL(url);
    }
    return this;
  }

  /**
   * @description Sets the color of the embed.
   * @param color - Hexadecimal numeric hex color code.
   * @returns The embed this was called on.
   */
  setColor(color?: number): Embed {
    this.embed.color = color;
    return this;
  }

  /**
   * @description Sets the timestamp of the embed to the moment at which it is called.
   * @returns The embed this was called on.
   */
  setTimestamp(): Embed {
    this.embed.timestamp = new Date().toISOString();
    return this;
  }

  /**
   * @description Sets the footer of the embed.
   * @param text - Text of the footer.
   * @param icon_url - URL icon for the footer.
   * @returns The embed this was called on.
   */
  setFooter(text: string, icon_url?: UrlLike): Embed {
    this.embed.footer = {
      text,
      icon_url: getURL(icon_url ?? '')
    };
    return this;
  }

  /**
   * @description Sets the url of the embed.
   * @param url - URL of the thumbnail.
   * @returns The embed this was called on.
   */
  setThumbnail(url?: UrlLike): Embed {
    this.embed.thumbnail = { url: getURL(url ?? '') };
    return this;
  }

  /**
   * @description Sets the author of the embed.
   * @param name - Name of the author.
   * @param url - URL of the author title.
   * @param icon_url - URL to the author icon.
   * @returns The embed this was called on.
   */
  setAuthor(name: string, url?: UrlLike, icon_url?: UrlLike): Embed {
    this.embed.author = {
      name,
      url: getURL(url ?? ''),
      icon_url: getURL(icon_url ?? '')
    };
    return this;
  }

  /**
   * @description Adds a field to the embed. `name` and `value` are required.
   * @param name - Title of the field.
   * @param value - Value of the field.
   * @param inline - Whether or not the field should be inline.
   * @returns The embed this was called on.
   */
  addField(name: string, value: string, inline = false): Embed {
    this.embed.fields = [...this.embed.fields ?? [], {
      name: name,
      value: value,
      inline: inline
    }];
    return this;
  }

  /**
   * @description Adds a blank field to the embed.
   * @param {Boolean} inline - Whether or not the field should be inline.
   * @returns {Embed} The embed this was called on.
   */
  addBlankField(inline = false): Embed {
    this.embed.fields = [...this.embed.fields ?? [], {
      name: '\u200B',
      value: '\u200B',
      inline: inline
    }];
    return this;
  }

  /**
   * @description Sends a pre-formatted uh-oh message.
   * @param {string} message - The uh-oh message to send to the user.
   * @returns {Embed} The embed this was called on.
   */
  uhoh(message = ''): Embed {
    this.embed.title = 'Uh-oh!';
    this.embed.description = message;
    this.embed.color = 0xFF0000;
    return this;
  }

  /**
   * @description Send a preset success message.
   * @param message - The message to show user.
   * @returns The embed this was called on.
   */
  success(message = ''): Embed {
    this.embed.description = message;
    this.embed.color = 0x00FF00;
    return this;
  }

  showContent(): EmbedStructure {
    return this.embed;
  }

  [util.inspect.custom](depth: number, options: import('util').InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, 'special');
    } else {
      return this;
    }
  }

}
