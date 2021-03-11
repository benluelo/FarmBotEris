import { CropName } from "../../global.js"
import { MarketRequest as Request } from "../../global";
import farmerData from "./farmer-data"
const { getLevel } = require("../../helpers/level-test.js")

type Color = typeof farmerData.preferences.color[number]
type Taste = typeof farmerData.preferences.taste[number]

type Preferences = {
  color: Color
  taste: Taste[]
}

export class NPC {
  name: string
  gender: ("male" | "female")
  unlockableCrop: CropName
  wealth: number
  preferences: Preferences
  level: number
  unlockLevel: number
  emoji: string
  /**
   * @description Creates a new NPC.
   * @param name - The name of the NPC.
   * @param gender - The gender of the NPC. Either "male" or "female".
   * @param unlockableCrop - The crop that this user will unlock when they hit their unlock level (between `5` and `10`).
   * @param wealth - The wealth of the NPC. Must be `0 <= x <= 1`.
   * @param preferences - The preferences of the NPC.
   */
  constructor(name: string, gender: ("male" | "female"), unlockableCrop: CropName, wealth: number, preferences: Preferences) {
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

    this.emoji = farmerData.emoji[this.gender][Math.floor(Math.random() * farmerData.emoji[this.gender].length)]
  }

  /**
   * @description Creates a new request for the market.
   * @param {Object<string, {discovered: Boolean, level: Number, amount: Number}>} crops - The crops that the user has unlocked.
   * @returns {{id: string, req: Request}} A new request.
   */
  newRequest(crops: { [s in CropName]: { discovered: boolean; level: number; amount: number } }): { id: string; req: Request } {

    const rand = Math.random()
    const want = []
    const discoveredCrops = (Object.entries(crops)).reduce((prev, [crop, { discovered }]) => {
      if (discovered) {
        return [...prev, crop as CropName]
      }
      return prev
    }, [] as CropName[])

    // add one random crop from the list of discovered crops to the requests
    // if there is only one crop discovered, add a random amount of those to want
    // otherwise, check a random number against the wealth (more wealth = more possible requests)
    // after having looped through all of the discovered crops, return the request(s)

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

    const r: Request = {
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

// ...why did we do it like that
/**
 * @description Generates a random 3 character long ID, to be used in the database. Will match the regex `/[A-Z]{3}/`.
 * @returns The randomly generated ID.
 */
function getRandomID(): string {
  const letterValues: {
    [n: number]: string
  } = {}
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((v) => {
    letterValues[v.charCodeAt(0) - 65] = v
  })

  let num = Math.floor(Math.random() * Math.pow(Object.keys(letterValues).length, 3))
  let toReturn = ""
  while (num != 0) {
    const quotient = Math.floor(num / Object.keys(letterValues).length)
    const remainder = num % Object.keys(letterValues).length
    num = quotient
    toReturn += letterValues[remainder]
  }
  return toReturn
}