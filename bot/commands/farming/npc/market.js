const ms = require("parse-ms")
const { Embed } = require("../../../lib/classes")
const { parsePlotNumber } = require("../../../lib/parse-plot-number.js")

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

exports.run = (bot) => {
  bot.registerCommand("market", (message, args) => {
  }, bot.cooldown(15000))
}