"use strict";
const plotRegex = /^[a-e]{1}[1-5]{1}$/;
// this was an interesting way to do it for sure. using base 5 and parsing a number out of it was... creative
/**
 * @description Parses the supplied plot number.
 * @param str - The plot number to get the value of, in the format `<letter><number>`.
 * @returns The value of the plot supplied, or `false` if the input was not in valid format.
 */
module.exports.parsePlotNumber = (str) => {
    // check that the plot is in <letter><number> format
    if (!plotRegex.test(str)) {
        return false;
    }
    // if correct format, create an object that holds the plot coordinates
    // cast is safe since we know the regex matched
    const letterAndNumber = {
        letter: formatForPlotNumber(str[1]),
        number: formatForPlotNumber(str[0])
    };
    // get the plot number, base 5
    return parseInt(((letterAndNumber.number + letterAndNumber.letter)), 5);
};
/**
 * @description Formats the individual `letter` and `number` portions of the plot number.
 * @param str - The `number` or `letter` to format for the plot.
 * @returns The index of the plot.
 */
function formatForPlotNumber(str) {
    switch (str) {
        case ("1"):
        case ("a"): return "0";
        case ("2"):
        case ("b"): return "1";
        case ("3"):
        case ("c"): return "2";
        case ("4"):
        case ("d"): return "3";
        case ("5"):
        case ("e"): return "4";
    }
    throw new Error("unformattable plot number: " + str);
}
