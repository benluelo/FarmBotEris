const { NPC } = require("./npc.js")
const fetch = require("node-fetch")
const  tr  = require("transliteration").transliterate
// const argv = require("yargs").argv

// console.log(argv)

// const region = argv.region | "Canada"

module.exports.run = async (region) => {
  /**
   * @type {NPC[]}
   */
  const farmers = []
  const data = await fetch(new URL(`https://uinames.com/api/?amount=${11}&region=${region}`))
  const json = await data.json()
  json.forEach(element => {
    farmers.push(new NPC(tr(element.name + " " + element.surname), element.gender))
  })
  return farmers
}