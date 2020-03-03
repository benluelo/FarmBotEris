const { CommandClient } = require("eris")
const { coin } = require("../lib/emoji.json")

/**
 * @typedef {FarmBotClient} FarmBotClient
 */
class FarmBotClient extends CommandClient {
  /**
   * @description Creates an instance of `FarmBotClient`.
   * @param {String} token - The bot token to log into discord with.
   * @param {import("eris").ClientOptions} options - The {@link import("eris").ClientOptions} for the `FarmBotClient`.
   * @param {import("eris").CommandClientOptions} commandOptions - The {@link import("eris").CommandClientOptions} for the `FarmBotClient`.
   */
  constructor(token, options, commandOptions) {
    super(token, options, commandOptions)

    /**
     * @type {Object}
     * @prop {import("mongodb").MongoClient} database.db - The database.
     * @prop {import("mongodb").Collection} database.Userdata - The userdata collection (`farmbot -> farm`).
     */
    this.database = undefined
    this.db = undefined
    this.Cooldowns = new (require("./classes")).Cooldowns()

    /**
     * @type {Map<string, import("./Command.js")>}
     */
    this.Commands = new Map()

    console.log(this.Cooldowns)
    /**
     * @type {Object<string, number>} - The different colors for the bot.
     */
    this.color = {
      market: 0x964b00,
      darkgreen: 0x004C00,
      lightgreen: 0x00FF00,
      success: 0x00FF00,
      error: 0xFF0000
    }

    this.log = require("../src/logger.js") // lmao i just watched that // LISTEN OK (i got nothin) // it aint working? // no but i think i know why one sec

    this.Embed = require("./classes.js").Embed

    this.ownersIDs = require("../config.js").ownersIDs

    this.config = require("../config.js")
  }
  async onMessageCreate(msg) {
    // copied from Client.js (don't actually think this is being used as i don't know how to use em lmao)
    /**
     * @description Create a message in a channel.
     * Note: If you want to DM someone, the user ID is **not** the DM channel ID. use Client.getDMChannel() to get the DM channel for a user.
     *
     * @param {String | Array | Object} content - A string, array of strings, or object. If an object is passed:
     * @param {String} content.content - A content string.
     * @param {Object} [content.embed] - An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure.
     * @param {Boolean} [content.tts] - Set the message TTS flag.
     * @param {Boolean} [content.disableEveryone] - Whether to filter @everyone/@here or not (overrides default).
     * @param {Object | Object[]} [file] - A file object (or an Array of them).
     * @param {Buffer} file.file - A buffer containing file data.
     * @param {String} file.name - What to name the file.
     * @returns {Promise<import("eris").Message>} - The message that was sent.
     */
    msg.send = (content, file) => {
      return this.createMessage(msg.channel.id, content, file)
    }
    super.onMessageCreate(msg)
  }

  /**
   * @description Sends a message telling the user that they haven't started with the bot yet.
   * @param {import("eris").Message} message - The message that was sent to the command.
   * @returns {Promise<import("eris").Message>} - The message that was sent to the user.
   */
  startMessage(message) {
    return message.send(new this.Embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`))
  }

  /**
   * @callback GetUserCallback
   * @param {import("mongodb").MongoError} err
   * @param {import("../lib/user.js").User} userdata - The user's data.
   */
  /**
   * @description Gets a user from the database.
   * @param {String} userID - The user's id.
   * @param {GetUserCallback} cb - The callback.
   */
  getUser(userID, cb) {
    this.database.Userdata.findOne({ userID: userID }, (e, u) => {
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
   * @description Formats money for sending to the user. Appends the coin emoji to the end.
   * @param {Number} value - The amount you want to format as money.
   * @returns {String} - The formatted money amount.
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
   * @description Returns a cooldown object for the Eris `CommandClient.registerCommand()` method.
   * @param {String} nameOfCommand - The name of command the cooldown is responsible for.
   *
   * @param {Number} length - The length of the cooldown to set, in milliseconds.
   * @returns {CooldownObject} {@link CooldownObject}.
   */
  cooldown(nameOfCommand, length) {
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
     * @description Channel ID; a string containing only numbers.
     * @typedef {String} ChannelID
     */
    /**
     * @description The cooldown object for the Eris `CommandClient.registerCommand()` method.
     * @typedef {Object} CooldownObject
     * @prop {Number} cooldown - The length of the cooldown.
     * @prop {function():String} cooldownMessage - The message to send when the command is used when the cooldown is still active.
     * @prop {Object} cooldownExclusions - Any exclusions to the cooldown.
     * @prop {ChannelID[]} cooldownExclusions.channelIDs - {@link ChannelID} Exclusions to the cooldown.
     */
  }

  /**
   * @description Initializes the database.
   */
  async initDB() {
    const client = require("mongodb").MongoClient
    const config = require("../config.js")

    client.connect(config.db.connectionString, config.db.connectionOptions, async (err, db) => {
      if (err) { throw err }

      if (this._db) {
        if (process.env.DEBUG === "true") { console.warn("trying to init DB again!") }
      }
      this._db = db
      if (db) {
        const c = db
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