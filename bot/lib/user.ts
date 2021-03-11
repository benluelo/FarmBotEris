import CONSTANTS from "./CONSTANTS";
const { ownersIDs } = require("../config.js")
const uuid = require("uuid").v4
import regions from "../lib/names.json";
import flags from "../lib/flags.json"

import { User as ErisUser } from "eris"
import { CropName, Farmer, MarketRequest, Plot, Seed } from "../../global"

import { NPC } from "./npc"

type flags = typeof flags;

class User {
  /** The ID of the user. */
  userID
  /** The username and discriminator of the user. */
  userTag
  /** The user's nickname. */
  nickname
  /** The region that the user is in. */
  region: {
    /** The name of the region. */
    name: keyof typeof regions,
    /**
     * The flag of the region.
     * soon... https://github.com/microsoft/TypeScript/issues/32063
     */
    flag: typeof flags[Lowercase<keyof typeof regions>]
  }
  /** unused. */
  messagesUserSent: number
  /** unused. */
  botCommandsUsed: number
  /** The amount of money the user has. */
  money: number
  /** The user's farm. */
  farm: Plot[]
  /** The user's seeds. */
  seeds: {
    common: Record<CropName, Seed>
  }
  /** The user's current requests. */
  requests: Record<string, MarketRequest>
  /** The farmers in the user's village. */
  farmers: Farmer[]
  /** The farmers in the user's village. */
  permissions: (typeof CONSTANTS.PERMISSIONS)[keyof typeof CONSTANTS.PERMISSIONS]
  /** When the user's last market refresh was. */
  requestTimeOut: number
  /** How many new requests the user has left for the hour. */
  requestAmount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  /** The user's UUID, for logging into the farmbot website. */
  uuid: string
  updated = true
  /**
   * @description Creates a new user for the database.
   * @param author - The author of the message.
   * @param region - The region that the user is farming in.
   * @param farmers - The farmers of the user (i.e. their "village").
   */
  constructor(author: ErisUser, region: string, farmers: Farmer[]) {
    this.userID = author.id
    this.userTag = author.username + "#" + author.discriminator
    this.nickname = author.username
    this.region = {
      name: region as keyof typeof regions,
      flag: flags[region as Lowercase<keyof typeof regions>]
    }
    this.messagesUserSent = 0
    this.botCommandsUsed = 0
    this.money = 0
    this.farm = [
      {
        crop: {
          planted: "dirt",
          datePlantedAt: Date.now()
        },
        fertilized: false,
        watered: false
      }
    ]
    this.seeds = {
      common: {
        apple: {
          discovered: true,
          level: 0,
          amount: 0
        },
        orange: {
          discovered: false,
          level: 0,
          amount: 0
        },
        lemon: {
          discovered: false,
          level: 0,
          amount: 0
        },
        pear: {
          discovered: false,
          level: 0,
          amount: 0
        },
        cherry: {
          discovered: false,
          level: 0,
          amount: 0
        },
        peach: {
          discovered: false,
          level: 0,
          amount: 0
        },
        mango: {
          discovered: false,
          level: 0,
          amount: 0
        },
        melon: {
          discovered: false,
          level: 0,
          amount: 0
        },
        grapes: {
          discovered: false,
          level: 0,
          amount: 0
        },
        strawberry: {
          discovered: false,
          level: 0,
          amount: 0
        },
        banana: {
          discovered: false,
          level: 0,
          amount: 0
        },
        pineapple: {
          discovered: false,
          level: 0,
          amount: 0
        }
      }
    }
    this.requests = {}
    this.farmers = farmers
    this.permissions = ownersIDs.includes(author.id) ? CONSTANTS.PERMISSIONS.DEVELOPMENT : CONSTANTS.PERMISSIONS.EVERYONE
    this.requestTimeOut = 0
    this.requestAmount = 9
    this.uuid = uuid()
    this.updated = true
  }

  newRequest(returnRequest = false) {
    const randomFarmer = this.farmers[Math.floor(Math.random() * this.farmers.length)]
    const randomReq = new NPC(randomFarmer.name, randomFarmer.gender, randomFarmer.unlockableCrop, randomFarmer.wealth, randomFarmer.preferences)
      .newRequest(this.seeds.common)
    if (returnRequest) {
      return randomReq
    }
    this.requests[randomReq.id] = randomReq.req
  }
}

class UserData extends User {
  /**
   * @description Essentially the same as `User`, except it allows for the creation of a `User` object with an existing userdata.
   * @todo Merge `User` and `UserData`.
   * @param {import("eris").User} author - The author of the message.
   * @param {User} userdata - The userdata object from the database.
   */
  constructor(author: import("eris").User, userdata: User) {
    super(author, userdata.region.name, userdata.farmers)
    this.seeds = userdata.seeds
    this.botCommandsUsed = userdata.botCommandsUsed
    this.farm = userdata.farm
    this.messagesUserSent = userdata.messagesUserSent
    this.money = userdata.money
    this.nickname = userdata.nickname
    this.permissions = userdata.permissions
    this.requestAmount = userdata.requestAmount
    this.requestTimeOut = userdata.requestTimeOut
    this.seeds = userdata.seeds
    this.updated = true
  }
}

// uncommon:{
//     rose: {
//         discovered: false,
//
//     }

// },
// rare: {
//     corn: {
//         discovered: false,
//
//     }
// },
// epic: {
//     tulip: {
//         discovered: false,
//
//     }
// },
// legendary: {
//     broccoli: {
//         discovered: false,
//
//     }
// },
// mythical:{
//     carrot: {
//         discovered: false,
//
//     }
// },
// seasonal:{
//     christmas_tree: {
//         discovered: false,
//
//     }
// }