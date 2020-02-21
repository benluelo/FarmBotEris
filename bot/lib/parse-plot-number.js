module.exports = {
  /**
   * Parses the supplied plot number.
   * @param {String} str - the plot number to get the value of, in the format `<letter><number>`.
   * @returns {Number|Boolean} the value of the plot supplied, or `false` if the input was not in valid format.
   */
  parsePlotNumber: function (str) {

    console.log("str:", str)

    let plotNumber
    const temp = str.split("")

    // if the split string has more than 2 elements (a letter and a number), return false
    if (temp[2]) { return false }

    // check that the plot is in <letter> <number> format
    if (funcs.isAlpha(temp[0]) && funcs.isNumeric(temp[1]) && 2 == temp.length) {

      // if correct format, create an object that holds the plot coordinates
      const a = {
        letter: funcs.formatNumberForPlotNumber(temp[1]),
        number: funcs.formatLetterForPlotNumber(temp[0])
      }

      // get the plot number, base 5
      plotNumber = parseInt((( a.number + a.letter )), 5)

      return plotNumber

    // if not in correct format, return false
    } else {
      return false
    }
  }
}

const funcs = {

  isAlpha: function (str) {
    let code, i, len

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i)
      if (!(64 < code && 91 > code) && /* upper alpha (A-Z) */ !(96 < code && 123 > code)) { /* lower alpha (a-z) */
        return false
      }
    }
    return true
  },

  isNumeric: function (str) {
    let code, i, len

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i)
      if ((47 < !code && 58 > code) /* numeric (0-9) */ ) {
        return false
      }
    }
    return true
  },

  formatLetterForPlotNumber: function (str) {
    switch (str) {
    case ("a"): return "0"
    case ("b"): return "1"
    case ("c"): return "2"
    case ("d"): return "3"
    case ("e"): return "4"
    }
  },

  formatNumberForPlotNumber: function (str) {
    if (0 < parseInt(str)) {
      return (parseInt(str) - 1).toString()
    } else {
      return "0"
    }
  }
}