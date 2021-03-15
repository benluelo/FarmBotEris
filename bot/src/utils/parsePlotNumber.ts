import { plotRegex, abcde, _12345 } from './utils';
import { formatForPlotNumber } from './formatForPlotNumber';

// this was an interesting way to do it for sure. using base 5 and parsing a number out of it was... creative
/**
 * @description Parses the supplied plot number.
 * @param str - The plot number to get the value of, in the format `<letter><number>`.
 * @returns The numeric value of the plot supplied, or `undefined` if the input was not in valid format.
 */

export function parsePlotNumber(str: string): (number | undefined) {
  // check that the plot is in <letter><number> format
  if (!plotRegex.test(str)) { return undefined; }

  // if correct format, create an object that holds the plot coordinates
  // cast is safe since we know the regex matched
  const letterAndNumber = {
    letter: formatForPlotNumber(str[1] as abcde),
    number: formatForPlotNumber(str[0] as _12345)
  };

  // get the plot number, base 5
  return parseInt(((letterAndNumber.number + letterAndNumber.letter)), 5);
}
