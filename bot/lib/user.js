const flags = require("./flags.json")
const { PERMISSIONS } = require("./CONSTANTS.js")
const { ownersIDs } = require("../config.js")
const uuid = require("uuid").v4

const { NPC } = require("./npc.js")


/**
 * @typedef {User} User
 */
class User {
  /**
   * @description Creates a new user for the database.
   * @param {import("eris").User} author - The author of the message.
   * @param {String} region - The region that the user is farming in.
   * @param {import("./npc").Farmer[]} farmers - The farmers of the user (i.e. their "village").
   */
  constructor(author, region, farmers) {
    /** @prop {String} - The ID of the user. */
    this.userID = author.id,
    /** @prop {String} - The username and discriminator of the user. */
    this.userTag = author.username + "#" + author.discriminator,
    /** @prop {Object} region - The region that the user is in. */
    this.nickname = author.username,
    /** @prop {Object} */
    this.region = {
      /** @prop {String} - The name of the region. */
      name: region,
      /** @prop {String} - The flag of the region. */
      flag: flags[region]
    },
    /** @prop {Number} */
    this.messagesUserSent = 0,
    /** @prop {Number} */
    this.botCommandsUsed = 0,
    /** @prop {Number} - The amount of money the user has. */
    this.money = 0,
    /** @prop {Plot[]} - The user's farm. */
    this.farm = [
      {
        crop: {
          planted: "dirt",
          datePlantedAt: Date.now()
        },
        fertilized: false,
        watered: false
      }
    ],
    /** @prop {Object} seeds - The user's seeds. */
    this.seeds = {
      // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
      /** @prop {Object<string, Seed>} */
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
    },
    /** @prop {Object<string, Request>} - The user's current requests. */
    this.requests = {},
    /** @prop {import("./npc").Farmer[]} - The farmers in the user's village. */
    this.farmers = farmers,
    /** @prop {(0 | 1 | 2 | 3)} - The farmers in the user's village. */
    this.permissions = ownersIDs.includes(author.id) ? PERMISSIONS.DEVELOPMENT : PERMISSIONS.EVERYONE
    /** @prop {Number} - When the user's last market refresh was. */
    this.requestTimeOut = 0
    /** @prop {(0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)} - How many new requests the user has left for the hour. */
    this.requestAmount = 9
    /** @prop {string} - The user's UUID, for logging into the farmbot website. */
    this.uuid = uuid()
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
  constructor(author, userdata) {
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

module.exports = {
  User,
  UserData
}

/**
 * @typedef {Object} Plot
 * @prop {Object} crop
 * @prop {import("./crop-data.js").CropName} crop.planted - The crop currently planted on the plot.
 * @prop {Number} crop.datePlantedAt - The time that the crop was planted at.
 * @prop {Boolean} fertilized - Whether or not the plot is fertilized. **Not yet implemented**!
 * @prop {Boolean} watered - Whether or not the plot is watered. **Not yet implemented**!
 */
/**
 * @typedef {Object} Seed
 * @prop {Boolean} discovered - Whether or not the crop has been discovered.
 * @prop {Number} level - The level of the seed (i.e. it's experience level).
 * @prop {Number} amount - The amount of the seed that the user has in their inventory.
 */

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