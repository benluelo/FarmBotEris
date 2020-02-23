/**
 * @module src/get-user
 */

/**
 * Gets a user from the database.
 * @param {String} userID - the user's id
 * @param {GetUserCallback} cb - the callback
 */
module.exports = function getUser(userID, cb) {
  this.database.Userdata.findOne({ userID: userID }, /** @param {import("../lib/user.js").UserData} u */ (e, u) => {
    if (e) {
      return cb(e)
    }

    if (u) {
      return cb(null, u)
    } else {
      return cb(null, null)
    }
  })
}

/**
 * @callback GetUserCallback
 * @param {import("mongodb").MongoError} err
 * @param {import("../lib/user.js").UserData} userdata - the user's data
 */

/**
 * @typedef {Object} GetUserCallbackObject
 * @property {import("mongodb").MongoError} err
 * @property {import("../lib/user.js").UserData} userdata - the user's data
 */

// let PowerOf2 = {
//   [Symbol.iterator]() {
//     let exponent = 0
//     return {
//       exponent,
//       next() {
//         exponent++
//         return { done: false, value: Math.pow(2, exponent) }
//       }
//     }
//   }
// }
