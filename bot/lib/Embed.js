import { URL } from "url";
import util from "util";
import { Attachment } from "./Attachment";
/**
 * @description Gets the image url out of the provided object.
 * @param obj - The {@link URL}, {@link Attachment}, or string to get the image url from.
 * @returns The url for the image.
 */
export function getURL(obj) {
    if (obj instanceof URL) {
        return obj.href;
    }
    else if (obj instanceof Attachment) {
        return obj.link();
    }
    else {
        return obj;
    }
}
export class Embed {
    constructor(embed) {
        this.embed = { fields: [] };
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
    setTitle(title) {
        this.embed.title = title;
        return this;
    }
    /**
     * @description Sets the description of the embed.
     * @param description - Description of embed.
     * @returns The embed this was called on.
     */
    setDescription(description) {
        this.embed.description = description;
        return this;
    }
    /**
     * @description Sets the url of the embed.
     * @param url - URL for the embed.
     * @returns The embed this was called on.
     */
    setUrl(url) {
        if (url === undefined) {
            this.embed.url = undefined;
        }
        else {
            this.embed.url = getURL(url);
        }
        return this;
    }
    /**
     * @description Sets the color of the embed.
     * @param color - Hexadecimal numeric hex color code.
     * @returns The embed this was called on.
     */
    setColor(color) {
        this.embed.color = color;
        return this;
    }
    /**
     * @description Sets the timestamp of the embed to the moment at which it is called.
     * @returns The embed this was called on.
     */
    setTimestamp() {
        this.embed.timestamp = new Date().toISOString();
        return this;
    }
    /**
     * @description Sets the footer of the embed.
     * @param text - Text of the footer.
     * @param icon_url - URL icon for the footer.
     * @returns The embed this was called on.
     */
    setFooter(text, icon_url) {
        this.embed.footer = {
            text,
            icon_url: getURL(icon_url ?? "")
        };
        return this;
    }
    /**
     * @description Sets the url of the embed.
     * @param url - URL of the thumbnail.
     * @returns The embed this was called on.
     */
    setThumbnail(url) {
        this.embed.thumbnail = { url: getURL(url ?? "") };
        return this;
    }
    /**
     * @description Sets the author of the embed.
     * @param name - Name of the author.
     * @param url - URL of the author title.
     * @param icon_url - URL to the author icon.
     * @returns The embed this was called on.
     */
    setAuthor(name, url, icon_url) {
        this.embed.author = {
            name,
            url: getURL(url ?? ""),
            icon_url: getURL(icon_url ?? "")
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
    addField(name, value, inline = false) {
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
    addBlankField(inline = false) {
        this.embed.fields = [...this.embed.fields ?? [], {
                name: "\u200B",
                value: "\u200B",
                inline: inline
            }];
        return this;
    }
    /**
     * @description Sends a pre-formatted uh-oh message.
     * @param {string} message - The uh-oh message to send to the user.
     * @returns {Embed} The embed this was called on.
     */
    uhoh(message = "") {
        this.embed.title = "Uh-oh!";
        this.embed.description = message;
        this.embed.color = 0xFF0000;
        return this;
    }
    /**
     * @description Send a preset success message.
     * @param {string} message - The message to show user.
     * @returns {Embed} The embed this was called on.
     */
    success(message = "") {
        this.embed.description = message;
        this.embed.color = 0x00FF00;
        return this;
    }
    showContent() {
        return this.embed;
    }
    [util.inspect.custom](depth, options) {
        if (depth == 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        else {
            return this;
        }
    }
}
