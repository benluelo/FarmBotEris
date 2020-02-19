const { NPC } = require("./npc.js")
const fetch = require("node-fetch")
const { color, taste } = require("./preferences.json")
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
    farmers.push(new NPC(tr(element.name + " " + element.surname), Math.random(), element.gender, {
      color: color[Math.floor(Math.random() * color.length)],
      taste: taste[Math.floor(Math.random() * taste.length)]
    }))
  })
  return farmers
}