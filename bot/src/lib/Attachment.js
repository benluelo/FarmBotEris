import util from "util";
import { readFileSync } from "fs";
import { resolve } from "path";
export class Attachment {
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
