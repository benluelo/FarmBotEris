import { flags } from "./flags"
import { CONSTANTS } from "./CONSTANTS"
import * as config from "../config"
import { v4 as uuid } from "uuid"
import type { CropInfo } from "./crop-data"
import type { Farmer } from "./npc"

export class User {
  /** The ID of the user. */
  userID: string
  /** The username and discriminator of the user. */
  userTag: string
  nickname: string
  /** The region that the user is in. */
  region: {
    /** The name of the region. */
    name: string;
    /** The flag of the region. */
    flag: string;
  }
  messagesUserSent: number
  botCommandsUsed: number
  /** The amount of money the user has. */
  money: number
  /** The user's farm. */
  farm: Plot[]
  /** The user's seeds. */
  // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
  seeds: {
    [rarity: string]: {
      [crop in CropInfo.CropName]: Seed
    }
  }
  /** The user's current requests. */
  requests: { [s: string]: MarketRequest}
  /** The farmers in the user's village. */
  farmers: Farmer[]
  /** The farmers in the user's village. */
  permissions: 0 | 1 | 2 | 3
  /** When the user's last market refresh was. */
  requestTimeOut: number
  /** How many new requests the user has left for the hour. */
  requestAmount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  uuid: string

  /**
   * @description Creates a new user for the database.
   * @param author - The author of the message.
   * @param region - The region that the user is farming in.
   * @param farmers - The farmers of the user (i.e. their "village").
   */
  constructor(author: import("eris").User, region: string, farmers: Farmer[]) {
    this.userID = author.id
    this.userTag = author.username + "#" + author.discriminator
    this.nickname = author.username
    this.region = {
      name: region,
      flag: flags[region]
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
      // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
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
    this.permissions = <0 | 1 | 2 | 3>(config.default.ownersIDs.includes(author.id) ? CONSTANTS.PERMISSIONS.DEVELOPMENT : CONSTANTS.PERMISSIONS.EVERYONE)
    this.requestTimeOut = 0
    this.requestAmount = 9
    this.uuid = uuid()
  }

  newRequest(returnRequest: boolean = false) {
    const randomFarmer: Farmer = this.farmers[Math.floor(Math.random() * this.farmers.length)]
    const randomReq = randomFarmer.newRequest(this.seeds.common)
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
  }
}

export interface Plot {
  crop: {
    /** The crop currently planted on the plot. */
    planted: CropInfo.CropName | "dirt"
    /** The time that the crop was planted at. */
    datePlantedAt: number
  }
  /** Whether or not the plot is fertilized. **Not yet implemented**! */
  fertilized: boolean
  /** Whether or not the plot is watered. **Not yet implemented**! */
  watered: boolean
}

export interface Seed {
  /** Whether or not the crop has been discovered. */
  discovered: boolean;
  /** The level of the seed (i.e. it's experience level). */
  level: number;
  /** The amount of the seed that the user has in their inventory. */
  amount: number
}

export interface MarketRequest {
  /** The name of the farmer who's request this is. */
  name: string;
  /** What the farmer wants. */
  want: {
    /** The crop they want. */
    crop: CropInfo.CropName;
    /** The amount of the crop they want. */
    amount: number;
  }[]
  /** How much they are willing to pay. */
  value: number;
  /** How much reputation filling the request gives. */
  reputation: number;
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