import util from 'util';
import { getLevel } from '../utils/level-test.js';
import { ProgressBar } from './ProgressBar.js';

export class XPProgressBar extends ProgressBar {
  private _level: number;
  /**
   * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
   * @param exp - The amount of experience points. Must be `>= 0`.
   * @param length - The length of the progress bar, in characters. Default is 10. Must be `>= 2`. Default `10`.
   * @param base - The base for the level calculation. Must be `>= 2`. Default `2`.
   */
  constructor(exp: number, length = 10, base = 2) {
    const data = getLevel(base, exp);
    const numerator = data.numerator;
    const denominator = data.denominator;
    super(numerator, denominator, length);
    this._level = data.level;
  }

  show(): string {
    return `**${this.numerator}/${this.denominator}**xp\n` + super.show();
  }

  level(): number {
    return this._level;
  }

  [util.inspect.custom](depth: number, options: import('util').InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, 'special');
    } else {
      return this;
    }
  }
}
