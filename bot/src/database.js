const client = require("mongodb").MongoClient
const config = require("../config.json")

let _db

/**
 * This is just for type hinting lol
 * @param {InitDbCallback} callback
 */
function initDb(callback) {
  if (_db) {
    if (process.env.DEBUG === "true") { console.warn("trying to init DB again!") }
    return callback(null, _db)
  }
  client.connect(config.db.connectionString, config.db.connectionOptions, (err, db) => {
    if (err) {
      return callback(err)
    }
    _db = db
    return callback(null, _db)
  })
}

module.exports = {
  initDb
}

/**
 * @callback InitDbCallback
 * @param {?import("mongodb").MongoError} err
 * @param {?import("mongodb").MongoClient} db
 */