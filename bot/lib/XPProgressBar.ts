import util from "util";
import { ProgressBar } from "./ProgressBar";


export class XPProgressBar extends ProgressBar {
  private _level: any;
  /**
   * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
   * @param {number} exp - The amount of experience points. Must be `>= 0`.
   * @param {number} [length=10] - The length of the progress bar, in characters. Default is 10. Must be `>= 2`. Default `10`.
   * @param {number} [base=2] - The base for the level calculation. Must be `>= 2`. Default `2`.
   */
  constructor(exp: number, length: number = 10, base: number = 2) {
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

  [util.inspect.custom](depth: number, options: import("util").InspectOptionsStylized) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special");
    } else {
      return this;
    }
  }
}
