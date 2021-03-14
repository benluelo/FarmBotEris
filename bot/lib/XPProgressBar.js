import util from "util";
import { ProgressBar } from "./ProgressBar.js";
import getLevel from "../../helpers/level-test.js";
export class XPProgressBar extends ProgressBar {
    /**
     * @description An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops.
     * @param exp - The amount of experience points. Must be `>= 0`.
     * @param length - The length of the progress bar, in characters. Default is 10. Must be `>= 2`. Default `10`.
     * @param base - The base for the level calculation. Must be `>= 2`. Default `2`.
     */
    constructor(exp, length = 10, base = 2) {
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
