const flags = require("./flags.json")

class User {
  /**
   *
   * @param {import("eris").User} author - the author of the message.
   * @param {String} region
   * @param {import("./npc").Farmer[]} farmers
   */
  constructor(author, region, farmers) {
    this.userID = author.id,
    this.userTag = author.username + "#" + author.discriminator,
    this.nickname = author.username,
    this.region = {
      name: region,
      flag: flags[region]
    },
    this.messagesUserSent = 0,
    this.botCommandsUsed = 0,
    this.money = 0,
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
    },
    this.requests = [],
    this.farmers = farmers
  }
}

module.exports = {
  User
}

/**
 * @typedef {Object} UserData
 * @prop {String} userID - the ID of the user.
 * @prop {String} userTag - the username and discriminator of the user.
 * @prop {String} userID - the ID of the user.
 * @prop {Object} region - the region that the user is in.
 * @prop {String} region.name - the name of the region.
 * @prop {String} region.flag - the flag of the region.
 * @prop {Number} messagesUserSent
 * @prop {Number} botCommandsUsed
 * @prop {Number} money - the amount of money the user has.
 * @prop {Plot[]} farm - the user's farm.
 * @prop {Object} seeds - the user's seeds.
 * @prop {Object<string, {discovered: Boolean, level: Number, amount: Number}} seeds.common
 * @prop {import("./npc").Request[]} requests - the user's current requests.
 * @prop {import("./npc").Farmer[]} farmers - the farmers in the user's village.
 */

/**
 * @typedef {Object} Plot
 * @prop {Object} crop
 * @prop {import("./crop-data.js").CropName} crop.planted - the crop currently planted on the plot.
 * @prop {Number} crop.datePlantedAt - the time that the crop was planted at.
 * @prop {Boolean} fertilized - whether or not the plot is fertilized. **Not yet implimented!**
 * @prop {Boolean} watered - whether or not the plot is watered. **Not yet implimented!**
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