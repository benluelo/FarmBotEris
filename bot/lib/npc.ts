const farmerData = require("./farmer-data.js")
const { getLevel } = require("../../helpers/level-test.js")
import type { CropInfo } from "./crop-data"
import { MarketRequest, Seed } from "./user"

export class Farmer {
  wealth: number
  preferences: {
    color: CropInfo.CropColors;
    taste: CropInfo.CropFlavours
  }
  level: number
  unlockLevel: number
  emoji: any
  /**
   * @description Creates a new NPC.
   * @param name - The name of the NPC.
   * @param gender - The gender of the NPC. Either "male" or "female".
   * @param unlockableCrop - The crop that this user will unlock when they hit their unlock level (between `5` and `10`).
   * @param wealth - The wealth of the NPC. Must be `0 <= x <= 1`.
   * @param preferences - The preferences of the NPC.
   */
  constructor(
    public name: string,
    public gender: ("male" | "female"),
    public unlockableCrop: CropInfo.CropName,
    wealth?: number,
    preferences?: {
      color: CropInfo.CropColors;
      taste: CropInfo.CropFlavours
    }) {
    this.wealth = wealth || Math.random()
    this.preferences = preferences || {
      color: farmerData.preferences.color[Math.floor(Math.random() * farmerData.preferences.color.length)],
      taste: farmerData.preferences.taste[Math.floor(Math.random() * farmerData.preferences.taste.length)]
    }
    this.level = 0
    this.unlockLevel = Math.ceil(this.wealth * 10) // will be between 1 and 10, depending on the wealth of the farme

    this.emoji = farmerData.emoji[this.gender][Math.floor(Math.random() * farmerData.emoji[this.gender].length)]
  }

  /**
   * @description Creates a new request for the market.
   * @param crops - The crops that the user has unlocked.
   * @returns A new request.
   */
  newRequest(crops: { [crop in CropInfo.CropName]: Seed }): { id: string; req: MarketRequest } {

    const rand = Math.random()
    const want = []
    const discoveredCrops: CropInfo.CropName[] = []

    for (const crop in crops) {
      if (crops[<CropInfo.CropName>crop].discovered) {
        discoveredCrops.push(<CropInfo.CropName>crop)
      }
    }

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
    }

    const r: MarketRequest = {
      name: this.name,
      want: want,
      value: (this.wealth * rand) * 10 * 10 * getLevel(this.level).level,
      reputation: (1 - (this.wealth * rand)) * 10 * 10 * getLevel(this.level).level
    }
    return {
      id: this.getRandomID(),
      req: r
    }
  }

  /**
   * @description Generates a random 3 character long ID, to be used in the database. Will match the regex `/[A-Z]{3}/`.
   * @returns {String} The randomly generated ID.
   */
  private getRandomID(): string {
    const letterValues: { [k: number]: string } = {}
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
}