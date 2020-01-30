const funcs = require("./plotFunctions.js")
// const { log } = require("../src/logger.js")

module.exports = {
  /**
   * Parses the supplied plot number.
   * @param {String} str - the plot number to get the value of, in the format `<letter><number>`.
   * @returns {Number|Boolean} the value of the plot supplied, or `false` if the input was not in valid format.
   */
  parsePlotNumber: function (str) {

    console.log("str:", str)

    let plotNumber
    let temp = str.split("")

    // check that the plot is in <letter> <number> format
    if (funcs.isAlpha(temp[0]) && funcs.isNumeric(temp[1])) {

      // if correct format, create an object that holds the plot coordinates
      const a = {
        letter: funcs.formatForPlotNumberNUMBER(temp[1]),
        number: funcs.formatForPlotNumberLETTER(temp[0])
      }

      // log.default("a", JSON.stringify(a, null, 4))

      // get the plot number, base 5
      plotNumber = parseInt((( a.number + a.letter )), 5)

      // log.default("plotNumber", plotNumber)

      return plotNumber

      // if not in correct format, return false
    } else {
      return false
    }
  }
}