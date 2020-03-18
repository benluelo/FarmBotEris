const plotRegex = /^[a-e]{1}[1-5]{1}$/

/**
 * @description Parses the supplied plot number.
 * @param {String} str - The plot number to get the value of, in the format `<letter><number>`.
 * @returns {(Number | Boolean)} The value of the plot supplied, or `false` if the input was not in valid format.
 */
module.exports.parsePlotNumber = (str) => {

  if (process.env.DEBUG === "true") { console.log("str:", str) }

  // check that the plot is in <letter><number> format
  if (!plotRegex.test(str)) { return false }

  // if correct format, create an object that holds the plot coordinates
  const a = {
    letter: formatForPlotNumber(str[1]),
    number: formatForPlotNumber(str[0])
  }

  // get the plot number, base 5
  return parseInt((( a.number + a.letter )), 5)
}

/**
 * @description Formats the individual `letter` and `number` portions of the plot number.
 * @param {(("a" | "b" | "c" | "d" | "e") | ("1" | "2" | "3" | "4" | "5"))} str - The `number` or `letter` to format for the plot.
 * @returns {("0" | "1" | "2" | "3" | "4")} The index of the plot.
 */
function formatForPlotNumber(str) {
  switch (str) {
    case ("1"):
    case ("a"): return "0"
    case ("2"):
    case ("b"): return "1"
    case ("3"):
    case ("c"): return "2"
    case ("4"):
    case ("d"): return "3"
    case ("5"):
    case ("e"): return "4"
  }
}