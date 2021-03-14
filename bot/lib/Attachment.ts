import util from "util";
import { readFileSync } from "fs";
import { resolve } from "path";
import { CropName } from "../dtos/Crop.js";


export class Attachment {
  private crop: CropName;
  private size: number;
  private file: any;
  private name: string;

  constructor(crop: CropName, size = 150) {
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

  [util.inspect.custom](depth: number, options: import("util").InspectOptionsStylized) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special");
    } else {
      return this;
    }
  }
}
