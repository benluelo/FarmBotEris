/**
 * Gets a user from the database.
 * @param {String} userID - the user's id
 * @param {GetUserCallback} cb - the callback
 */
function getUser(userID, cb) {
  this.database.Userdata.findOne({ userID: userID }, /** @param {import("../../lib/user.js").UserData} userdata */ (err, userdata) => {
    if (err) {
      return cb(err)
    }

    if (userdata) {
      return cb(null, userdata)
    } else {
      return cb(null, null)
    }
  })
}

/**
 * @typedef {function():GetUserCallbackObject} GetUserCallback
 * @callback GetUserCallback
 * @param {GetUserCallbackObject} callback
 */

/**
 * @typedef {Object} GetUserCallbackObject
 * @property {import("mongodb").MongoError} err
 * @property {import("../lib/user.js").UserData} userdata - the user's data
 */

module.exports = getUser

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
