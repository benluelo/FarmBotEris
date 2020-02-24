const { coin } = require("../lib/emoji.json")

/**
 * @param {Number} value - the amount you want to format as money.
 */
module.exports = (value) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  })
  return formatter.format(value).substr(1) + " " + coin
}
