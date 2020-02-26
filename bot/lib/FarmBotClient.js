const { CommandClient } = require("eris")
const { coin } = require("../lib/emoji.json")

/**
 * @typedef {FarmBotClient} FarmBotClient
 */
class FarmBotClient extends CommandClient {
  constructor(token, options, commandOptions) {
    super(token, options, commandOptions)

    this.database = undefined
    this.db = undefined

    /**
     * @type {Object<string, number>} - the different colors for the bot.
     */
    this.color = {
      market: 0x964b00,
      darkgreen: 0x004C00,
      lightgreen: 0x00FF00,
      success: 0x00FF00,
      error: 0xFF0000
    }

    this.log = require("../src/logger.js") // lmao i just watched that // LISTEN OK (i got nothin) // it aint working? // no but i think i know why one sec
  }
  async onMessageCreate(msg) {
    // copied from Client.js (don't actually think this is being used as i don't know how to use em lmao)
    /**
    * Create a message in a channel
    * Note: If you want to DM someone, the user ID is **not** the DM channel ID. use Client.getDMChannel() to get the DM channel for a user
    * @arg {String | Array | Object} content A string, array of strings, or object. If an object is passed:
    * @arg {String} content.content A content string
    * @arg {Object} [content.embed] An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure
    * @arg {Boolean} [content.tts] Set the message TTS flag
    * @arg {Boolean} [content.disableEveryone] Whether to filter @everyone/@here or not (overrides default)
    * @arg {Object | Object[]} [file] A file object (or an Array of them)
    * @arg {Buffer} file.file A buffer containing file data
    * @arg {String} file.name What to name the file
    * @returns {Promise<Message>}
    */
    msg.send = (content, file) => {
      return this.createMessage(msg.channel.id, content, file)
    }
    super.onMessageCreate(msg)
  }

  /**
   * @param {import("eris").Message} message - the message that was sent to the command.
   */
  startMessage(message) {
    return message.send(new this.embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`))
  }

  /**
   * @callback GetUserCallback
   * @param {import("mongodb").MongoError} err
   * @param {import("../lib/user.js").User} userdata - the user's data
   */
  /**
   * Gets a user from the database.
   * @param {String} userID - the user's id
   * @param {GetUserCallback} cb - the callback
   */
  getUser(userID, cb) {
    this.database.Userdata.findOne({ userID: userID }, /** @param {import("../lib/user.js").User} u */ (e, u) => {
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
   * @param {Number} value - the amount you want to format as money.
   */
  formatMoney(value) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    })
    return formatter.format(value).substr(1) + " " + coin
  }

  /**
   * Returns a cooldown object for the Eris `CommandClient.registerCommand()` method.
   * @param {Number} length - the length of the cooldown to set, in milliseconds.
   * @returns {CooldownObject} {@link CooldownObject}
   */
  cooldown(length) {
    return {
      cooldown: length,
      cooldownMessage: () => {
        return `cooldown is ${length / 1000} seconds pls slow down`
      },
      cooldownExclusions: {
        channelIDs: [
          "669353094953435183" // dev stuff > #test-test
        ]
      }
    }
    /**
     * Channel ID; a string containing only numbers.
     * @typedef {String} ChannelID
     */
    /**
     * The cooldown object for the Eris `CommandClient.registerCommand()` method.
     * @typedef {Object} CooldownObject
     * @property {Number} cooldown - the length of the cooldown.
     * @property {function():String} cooldownMessage - the message to send when the command is used when the cooldown is still active.
     * @property {Object} cooldownExclusions - any exclusions to the cooldown.
     * @property {ChannelID[]} cooldownExclusions.channelIDs - {@link ChannelID} exclusions to the cooldown.
     */
  }

  /**
   * Initiates the database.
   */
  async initDB() {
    const client = require("mongodb").MongoClient
    const config = require("../config.json")

    client.connect(config.db.connectionString, config.db.connectionOptions, async (err, db) => {
      if (err) { throw err }

      if (this._db) {
        if (process.env.DEBUG === "true") { console.warn("trying to init DB again!") }
      }
      this._db = db
      if (db) {
        const c = db
        /**
         * @type {Object} database
         * @prop {import("mongodb").MongoClient} database.db - the database
         * @prop {import("mongodb").Collection} database.Userdata - the userdata collection (`farmbot -> farm`)
         */
        this.database = {
          db: c,
          Userdata: c.db("farmbot").collection("farm"),
        }
        this.log.dbconnect("Successfully connected to database!")
      }
    })
  }
}

module.exports = FarmBotClient