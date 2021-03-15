import util from 'util';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CropName } from '../dtos/Crop.js';


export class Attachment {
  private crop: CropName | 'dirt';
  private size: number;
  file: Buffer;
  name: string;

  constructor(crop: CropName | 'dirt', size = 150) {
    this.crop = crop;
    this.size = size;
    this.file = readFileSync(resolve(`./bot/images/png/${this.crop}.png`));
    this.name = `${crop}.png`;
  }

  send(): {
    file: Buffer;
    name: string;
  } {
    return {
      file: this.file,
      name: this.name
    };
  }

  link(): string {
    return `attachment://${this.name}`;
  }

  [util.inspect.custom](depth: number, options: import('util').InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, 'special');
    } else {
      return this;
    }
  }
}
