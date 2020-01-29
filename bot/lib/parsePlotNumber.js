const parse = require("./plotFunctions.js")
const { log } = require("../src/logger.js")

module.exports = {

  pNum: function (str) {

    console.log("str:", str)

    let plotNumber
    let temp = str.split("")

    // check that the plot is in <letter> <number> format
    if(parse.isAlpha(temp[0]) && parse.isNumeric(temp[1])){

      // if correct format, create an object that holds the plot coordinates
      const a = {
        letter: parse.formatForPlotNumberNUMBER(temp[1]),
        number: parse.formatForPlotNumberLETTER(temp[0])
      }

      log.default("a", JSON.stringify(a, null, 4))

      // get the plot number, base 5
      plotNumber = parseInt((( a.number + a.letter )), 5)

      log.default("plotNumber", plotNumber)

      return plotNumber

      // if not in correct format, return false
    }else{
      return false
    }
  }
}