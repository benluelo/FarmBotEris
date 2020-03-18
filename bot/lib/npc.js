const farmerData = require("./farmer-data.js")
const { getLevel } = require("../../helpers/level-test.js")

class NPC {
  /**
   * @description Creates a new NPC.
   * @param {String} name - The name of the NPC.
   * @param {("male"  | "female")} gender - The gender of the NPC. Either "male" or "female".
   * @param {import("./crop-data.js").CropName} unlockableCrop - The crop that this user will unlock when they hit their unlock level (between `5` and `10`).
   * @param {Number} [wealth] - The wealth of the NPC. Must be `0 <= x <= 1`.
   * @param {{color: import("./farmer-data.js").colors, taste: import("./farmer-data.js").tastes}} [preferences] - The preferences of the NPC.
   */
  constructor(name, gender, unlockableCrop, wealth, preferences) {
    this.name = name
    this.gender = gender
    this.unlockableCrop = unlockableCrop
    this.wealth = wealth || Math.random()
    this.preferences = preferences || {
      color: farmerData.preferences.color[Math.floor(Math.random() * farmerData.preferences.color.length)],
      taste: farmerData.preferences.taste[Math.floor(Math.random() * farmerData.preferences.taste.length)]
    }
    this.level = 0
    this.unlockLevel = Math.ceil(this.wealth * 10) // will be between 1 and 10, depending on the wealth of the farmer

    // if (process.env.DEBUG === "true") { console.log(this.gender) }

    this.emoji = farmerData.emoji[this.gender][Math.floor(Math.random() * farmerData.emoji[this.gender].length)]
  }

  /**
   * @description Creates a new request for the market.
   * @param {Object<string, {discovered: Boolean, level: Number, amount: Number}>} crops - The crops that the user has unlocked.
   * @returns {{id: string, req: Request}} A new request.
   */
  newRequest(crops) {

    const rand = Math.random()
    const want = []
    const discoveredCrops = []

    for (const crop in crops) {
      if (crops[crop].discovered) {
        discoveredCrops.push(crop)
      }
    }

    // if (process.env.DEBUG === "true") { console.log("original:", discoveredCrops) }

    // add one random crop from the list of discovered crops to the requests
    // if there is only one crop discovered, add a random amount of those to want
    // otherwise, check a random number against the wealth (more wealth = more possible requests)
    // after having looped through all of the discovered crops, return the request(s)

    if (discoveredCrops.length === 1) {
      want.push({
        crop: discoveredCrops[0],
        amount: Math.ceil(Math.random() * this.wealth * 10)
      })
    } else {
      const randIndex = Math.floor(Math.random() * discoveredCrops.length)
      want.push({
        crop: discoveredCrops[randIndex],
        amount: Math.ceil(Math.random() * this.wealth * 10)
      })
      discoveredCrops.splice(randIndex, 1)
      for (const crop in discoveredCrops) {
        if (Math.random() < this.wealth) {
          want.push({
            crop: discoveredCrops[crop],
            amount: Math.ceil(Math.random() * this.wealth * 10)
          })
        }
      }
      // if (process.env.DEBUG === "true") { console.log(want) }
    }

    /**
     * @type {Request}
     */
    const r = {
      name: this.name,
      want: want,
      value: (this.wealth * rand) * 10 * 10 * getLevel(this.level).level,
      reputation: (1 - (this.wealth * rand)) * 10 * 10 * getLevel(this.level).level
    }
    return {
      id: getRandomID(),
      req: r
    }
  }
}

module.exports = {
  NPC
}

/**
 * @typedef {Object} Request
 * @prop {String} name - The name of the farmer who's request this is.
 * @prop {Object[]} want - What the farmer wants.
 * @prop {import("./crop-data.js").CropName} want[].crop - The crop they want.
 * @prop {Number} want[].amount - The amount of the crop they want.
 * @prop {Number} value - How much they are willing to pay.
 * @prop {Number} reputation - How much reputation filling the request gives.
 */

/**
 * @typedef {Object} Farmer
 * @prop {String} name - The name of the Farmer.
 * @prop {("male" | "female")} gender - The gender of the Farmer.
 * @prop {import("./crop-data.js").CropName} unlockableCrop - The crop that this user will unlock when they hit their unlock level.
 * @prop {Number} wealth - The wealth of the Farmer.
 * @prop {{color: import("./farmer-data.js").colors, taste: import("./farmer-data.js").tastes}} preferences - The preferences of the Farmer.
 * @prop {Number} level - The level of the Farmer (i.e. their experience points).
 * @prop {Number} unlockLevel - The level that the farmer will unlock their crop at  (between `5` and `10`).
 * @prop {String} emoji - The emoji of the Farmer.
 */

/**
 * @description Generates a random 3 character long ID, to be used in the database. Will match the regex `/[A-Z]{3}/`.
 * @returns {String} The randomly generated ID.
 */
function getRandomID() {
  const letterValues = {}
  // "0123456789".split("").forEach((v) => {
  //   letterValues[parseInt(v)] = v
  // })
  // "abcdefghijklmnopqrstuvwxyz".split("").forEach((v) => {
  //   letterValues[v.charCodeAt(0) - 87] = v
  // })
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((v) => {
    letterValues[v.charCodeAt(0) - 65] = v
  })

  return (function toSecretCode(num) {
    let toReturn = ""
    while (num != 0) {
      const quotient = Math.floor(num / Object.keys(letterValues).length)
      const remainder = num % Object.keys(letterValues).length
      num = quotient
      toReturn += letterValues[remainder]
    }
    return toReturn
  })(Math.floor(Math.random() * Math.pow(Object.keys(letterValues).length, 3)))
}