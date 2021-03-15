import util from 'util';


export class ProgressBar {
  /**
   * @description Creates a new ProgressBar.
   * @param numerator - The numerator for the progress bar.
   * @param denominator - The denominator for the progress bar.
   * @param length - The length of the progress bar in characters.
   */
  constructor(protected numerator: number, protected denominator: number, private length: number) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.length = length;
  }

  show(): string {
    const full = Math.floor((this.numerator / this.denominator) * this.length);
    const empty = Math.ceil(this.length - ((this.numerator / this.denominator) * this.length));
    return '█'.repeat(full) + '░'.repeat(empty);
  }

  [util.inspect.custom](depth: number, options: import('util').InspectOptionsStylized): string | this {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, 'special');
    } else {
      return this;
    }
  }
}
