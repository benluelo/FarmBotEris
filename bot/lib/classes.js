"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const util = require("util");
/**
 * @description Gets the image url out of the provided object.
 * @param obj - The {@link URL}, {@link Attachment}, or string to get the image url from.
 * @returns The url for the image.
 */
function getURL(obj) {
    if (obj instanceof url_1.URL) {
        return obj.href;
    }
    else if (obj instanceof Attachment) {
        return obj.link();
    }
    else {
        return obj;
    }
}
class Embed {
    constructor(embed = {
        title: undefined,
        description: undefined,
        url: undefined,
        color: undefined,
        timestamp: undefined,
        footer: {
            icon_url: undefined,
            text: undefined
        },
        thumbnail: {
            url: undefined
        },
        image: {
            url: undefined
        },
        author: {
            name: undefined,
            url: undefined,
            icon_url: undefined
        },
        fields: []
    }) {
        this.embed = embed;
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
     * @param {String} text - Text of the footer.
     * @param {(String | URL | Attachment)} icon_url - URL icon for the footer.
     * @returns {Embed} The embed this was called on.
     */
    setFooter(text, icon_url) {
        this.embed.footer.text = text;
        this.embed.footer.icon_url = getURL(icon_url ?? "");
        return this;
    }
    /**
     * @description Sets the url of the embed.
     * @param {(String | URL | Attachment)} url - URL of the thumbnail.
     * @returns {Embed} The embed this was called on.
     */
    setThumbnail(url) {
        this.embed.thumbnail.url = getURL(url ?? "");
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
        this.embed.author.name = name;
        this.embed.author.url = getURL(url ?? "");
        this.embed.author.icon_url = getURL(icon_url ?? "");
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
        this.embed.fields.push({
            name: name,
            value: value,
            inline: inline
        });
        return this;
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
        });
        return this;
    }
    /**
     * @description Sends a pre-formatted uh-oh message.
     * @param {String} message - The uh-oh message to send to the user.
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
     * @param {String} message - The message to show user.
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
class ProgressBar {
    /**
     * @description Creates a new ProgressBar.
     * @param numerator - The numerator for the progress bar.
     * @param denominator - The denominator for the progress bar.
     * @param length - The length of the progress bar in characters.
     */
    constructor(numerator, denominator, length) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.length = length;
        this.numerator = numerator;
        this.denominator = denominator;
        this.length = length;
    }
    show() {
        const full = Math.floor((this.numerator / this.denominator) * this.length);
        const empty = Math.ceil(this.length - ((this.numerator / this.denominator) * this.length));
        return "█".repeat(full) + "░".repeat(empty);
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
class XPProgressBar extends ProgressBar {
    /**
     * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
     * @param {Number} exp - The amount of experience points. Must be `>= 0`.
     * @param {Number} [length=10] - The length of the progress bar, in characters. Default is 10. Must be `>= 2`. Default `10`.
     * @param {Number} [base=2] - The base for the level calculation. Must be `>= 2`. Default `2`.
     */
    constructor(exp, length = 10, base = 2) {
        const { getLevel } = require("../../helpers/level-test.js");
        const data = getLevel(base, exp);
        const numerator = data.numerator;
        const denominator = data.denominator;
        super(numerator, denominator, length);
        this._level = data.level;
    }
    show() {
        return `**${this.numerator}/${this.denominator}**xp\n` + super.show();
    }
    level() {
        return this._level;
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
const { readFileSync } = require("fs");
const { resolve } = require("path");
class Attachment {
    constructor(crop, size = 150) {
        this.crop = crop;
        this.size = size;
        this.file = readFileSync(resolve(`./bot/images/png/${this.crop}.png`));
        this.name = `${crop}.png`;
    }
    send() {
        return {
            file: this.file,
            name: this.name
        };
    }
    link() {
        return `attachment://${this.name}`;
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
module.exports = {
    Embed,
    ProgressBar,
    XPProgressBar,
    Attachment
};
// eslint-disable-next-line no-unused-vars
const logx = (base, num) => {
    return Math.log(num) / Math.log(base);
};
