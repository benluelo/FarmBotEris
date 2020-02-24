const client = require("mongodb").MongoClient
const config = require("../config.json")

let _db

/**
 * @param {import("../index.js").Bot} bot
 */
module.exports = (bot) => {
  client.connect(config.db.connectionString, config.db.connectionOptions, (err, db) => {
    if (err) { throw err }

    if (_db) {
      if (process.env.DEBUG === "true") { console.warn("trying to init DB again!") }
    }
    _db = db
    if (db) {
      const c = db
      const dbObject = {
        db: c,
        Userdata: c.db("farmbot").collection("farm"),
      }
      bot.database = dbObject
      bot.log.dbconnect("Successfully connected to database!")
    }
  })
}