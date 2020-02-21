const farmerData = require("./farmer-data.js")
class NPC {
  /**
   * Creates a new NPC.
   * @param {String} name - The name of the NPC.
   * @param {("male"  | "female")} gender - The gender of the NPC. Either "male" or "female".
   * @param {Number} [wealth] - The wealth of the NPC. Must be `0 <= x <= 1`.
   * @param {{color: String, taste: String}} [preferences] - The preferences of the NPC.
   */
  constructor(name, gender, wealth, preferences) {
    console.log(farmerData)
    this.name = name
    this.wealth = wealth || Math.random()
    this.preferences = preferences || {
      color: farmerData.preferences.color[Math.floor(Math.random() * farmerData.preferences.color.length)],
      taste: farmerData.preferences.taste[Math.floor(Math.random() * farmerData.preferences.taste.length)]
    }
    this.level = 0
    this.gender = gender
    this.emoji = farmerData.emoji[this.gender][Math.floor(Math.random() * farmerData.emoji[this.gender].length)]
  }

  /**
   * Creates a new request for the market.
   * @param {Object.<string, {discovered: Boolean, level: Number, amount: Number}>} crops - the crops that the user has unlocked.
   */
  newRequest(crops) {

    console.log(Object.keys(crops))

    const rand = Math.random()
    const want = []
    let discoveredCrops = []

    for (const crop in crops) {
      if (crops[crop].discovered) {
        discoveredCrops.push(crop)
      }
    }

    // add one random crop from the list of discovered crops to the requests
    // if there is only one crop discovered, add a random amount of those to want
    // otherwise, check a random number against the wealth (more wealth = more possible requests)
    // after having looped through all of the discovered crops, return the request(s)

    if (1 === discoveredCrops.length) {
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
            crop: crop,
            amount: Math.ceil(Math.random() * this.wealth * 10)
          })
          discoveredCrops = discoveredCrops.filter(c => c != crop)
        }
      }
    }
    console.log(discoveredCrops)
    return {
      name: this.name,
      want: want,
      value: (this.wealth * rand) * 10,
      reputation: (1 - (this.wealth * rand)) * 10
    }
  }
}

module.exports = {
  NPC
}