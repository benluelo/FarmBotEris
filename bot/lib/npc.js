const farmerData = require("./farmer-data.json")
class NPC {
  /**
   * Creates a new NPC.
   * @param {String} name - The name of the NPC.
   * @param {("male"  | "female")} gender - The gender of the NPC. Either "male" or "female".
   * @param {Number} [wealth] - The wealth of the NPC. Must be `0 <= x <= 1`.
   * @param {{color: String, taste: String}} [preferences] - The preferences of the NPC.
   */
  constructor(name, gender, wealth, preferences){
    this.name = name
    this.wealth = wealth || Math.random()
    this.preferences = preferences || {
      color: farmerData.preferences.color[Math.floor(Math.random() * farmerData.prefercolor.length)],
      taste: farmerData.preferences.taste[Math.floor(Math.random() * farmerData.prefertaste.length)]
    }
    this.level = 0
    this.gender = gender
    this.emoji = farmerData[this.gender][Math.floor(Math.random() * farmerData[this.gender].length)]
  }

  /**
   * Creates a new request for the market.
   * @param {String[]} availableCrops - the crops that the user has unlocked.
   */
  newRequest(availableCrops){
    const rand = Math.random()
    return {
      name: this.name,
      want: [
        {
          crop: "apple",
          amount: 5
        },
        {
          crop: "grapes",
          amount: 4
        }
      ],
      value: (this.wealth * rand) * 10,
      reputation: (1 - (this.wealth * rand)) * 10
    }
  }
}

module.exports = {
  NPC
}