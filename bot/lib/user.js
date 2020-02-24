const flags = require("./flags.json")
const { PERMISSIONS } = require("./help-info.js")


/**
 * @typedef {User} User
 * @class
 */
class User {
  /**
   * @param {import("eris").User} author - the author of the message.
   * @param {String} region
   * @param {import("./npc").Farmer[]} farmers
   */
  constructor(author, region, farmers) {
    /** @prop {String} - the ID of the user. */
    this.userID = author.id,
    /** @prop {String} - the username and discriminator of the user. */
    this.userTag = author.username + "#" + author.discriminator,
    /** @prop {Object} region - the region that the user is in. */
    this.nickname = author.username,
    /** @prop {Object} */
    this.region = {
      /** @prop {String} - the name of the region. */
      name: region,
      /** @prop {String} - the flag of the region. */
      flag: flags[region]
    },
    /** @prop {Number} */
    this.messagesUserSent = 0,
    /** @prop {Number} */
    this.botCommandsUsed = 0,
    /** @prop {Number} - the amount of money the user has. */
    this.money = 0,
    /** @prop {Plot[]} - the user's farm. */
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
    /** @prop {Object<object, {Object<object, Seed}>} seeds - the user's seeds. */
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
    /** @prop {import("./npc").Request[]} - the user's current requests. */
    this.requests = [],
    /** @prop {import("./npc").Farmer[]} - the farmers in the user's village. */
    this.farmers = farmers,
    /** @prop {import("./help-info").PermissionsSymbol} - the farmers in the user's village. */
    this.permissions = PERMISSIONS.EVERYONE

    console.log(this)
  }
}

module.exports = {
  User
}

/**
 * @typedef {Object} Plot
 * @prop {Object} crop
 * @prop {import("./crop-data.js").CropName} crop.planted - the crop currently planted on the plot.
 * @prop {Number} crop.datePlantedAt - the time that the crop was planted at.
 * @prop {Boolean} fertilized - whether or not the plot is fertilized. **Not yet implemented!**
 * @prop {Boolean} watered - whether or not the plot is watered. **Not yet implemented!**

/**
 * @typedef {Object} Seed
 * @prop {Boolean} discovered - whether or not the crop has been discovered.
 * @prop {Number} level - the level of the seed (i.e. it's experience level).
 * @prop {Number} amount - the amount of the seed that the user has in their inventory.
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