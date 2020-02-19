const farmerEmoji = require("./farmer-emoji.json")
// console.log(farmerEmoji)
class NPC {
  constructor(name, wealth=0.5, gender="male", preferences={color: "purple", taste: "sweet"}){
    this.name = name
    this.wealth = wealth
    this.preferences = preferences
    this.level = 0
    this.gender = gender
    this.emoji = farmerEmoji[this.gender][Math.floor(Math.random() * farmerEmoji[this.gender].length)]
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