const { NPC } = require("./npc.js")
const getNames = require("./get-names.js")
const  tr  = require("transliteration").transliterate
// const argv = require("yargs").argv

// console.log(argv)

// const region = argv.region | "Canada"

module.exports.run = async (region) => {

  const randArray = new Array(11).fill().map(() => Math.random()).sort()
  const fruitsArray = Object.keys(require("./crop-data")).filter((name) => "apple" != name)
  /**
   * @type {import("./npc.js").Farmer[]}
   */
  const farmers = []
  const json = getNames(region)
  json.forEach((element) => {
    farmers.push(new NPC(tr(element.name + " " + element.surname), element.gender, fruitsArray.shift(), randArray.shift()))
  })
  return farmers
}