import type { DotenvParseOutput } from "dotenv"
import type * as Eris from "eris"
import type * as MongoDB from "mongodb"
import type { Message } from "eris"
import type { CommandInformationConstructor, FarmBotCommand, CommandFunction } from "./FarmBotCommandHandler"
import { FarmBotCommandHandler, Cooldowns, CommandInformation } from "./FarmBotCommandHandler"
import { CONSTANTS } from "./CONSTANTS"
import coin from "./emoji"
import { Client } from "eris"
import { Embed } from "./classes"
import { User } from "./user"
import { MongoClient } from "mongodb"
import * as config from "../config"
import { Log } from "../src/logger"

export class FarmBotClient extends Client {
  PERMISSIONS: any
  CATEGORIES: any
  ENV: any
  prefixes: readonly string[]
  database: {
    db: MongoDB.MongoClient,
    Userdata: MongoDB.Collection<User>
  }
  private _db: MongoDB.MongoClient
  Commands: FarmBotCommandHandler
  Cooldowns: Cooldowns
  log: typeof Log
  /** @description The Embed class, used for making new embeds. */
  Embed: typeof Embed
  ownersIDs: [string, string]
  config: any
  /** @description The different colors for the bot. */
  color: Readonly<{ market: number; darkgreen: number; lightgreen: number; success: number; error: number }>

  /**
   * @description Creates an instance of `FarmBotClient`.
   * @param dotenv - The environment variables, containing at least the bot token as `TOKEN`.
   * @param options - The {@link import("eris").ClientOptions} for the `FarmBotClient`.
   * @param prefixes - An array of the prefixes for the bot.
   */
  constructor(dotenv: DotenvParseOutput, options: Eris.ClientOptions, prefixes: string[]) {
    if (dotenv.TOKEN) {
      super(dotenv.TOKEN, options)
    } else {
      throw Error("No bot token!")
    }

    /** @description The different permission levels for a command. */
    this.PERMISSIONS = CONSTANTS.PERMISSIONS

    /** @description The different categories of commands. */
    this.CATEGORIES = CONSTANTS.CATEGORIES

    this.ENV = Object.freeze(dotenv)

    this.prefixes = Object.freeze(prefixes)

    this.on("messageCreate", this.onMessageCreate)

    this._db
    this.Commands = new FarmBotCommandHandler()

    this.log = require("../src/logger.js")
    this.Embed = Embed
    this.ownersIDs = <[string, string]>config.default.ownersIDs
    this.config = config.default
    this.color = Object.freeze({
      market: 0x964b00,
      darkgreen: 0x004C00,
      lightgreen: 0x00FF00,
      success: 0x00FF00,
      error: 0xFF0000
    })
  }

  /**
   * @description Ye.
   * @param {import("eris").Message} msg - The message from the messageCreate event.
   */
  async onMessageCreate(msg: Message) {
    if (msg.author.bot) { return }

    const args = msg.content.split(/\s+/)

    // check if a prefix was used; if a prefix was used, check if a command was used
    if (this._checkForPrefix(args.shift()) && this.Commands.has(args[0])) {
      if (this.Commands.get(args[0]).info.requiresUser) {
      // if a command was used, check if the caller can use the command
        this.getUser(msg.author.id, (err, userdata) => {
          if (err) { throw err }
          if (!userdata) {
            this.startMessage(msg)
          } else {
            this.Commands.run(args.shift(), msg, args, userdata)
          }
        })
      } else {
        this.Commands.run(args.shift(), msg, args)
      }
    }
  }

  /**
   * @description Adds a command to the bot.
   * @param name - The name of the command.
   * @param commandFunction - The command.
   * @param help - The help information for the command.
   * @param parent - If this is a subcommand, the command that it is a subcommand to.
   * @returns The newly added command.
   */
  addCommand(
    name: string,
    commandFunction: CommandFunction,
    help: CommandInformationConstructor,
    parent: FarmBotCommand): FarmBotCommand {
    const newCmd = this.Commands.set(name, commandFunction, new CommandInformation(help), parent)
    return newCmd
  }

  /**
   * @description Sends a message telling the user that they haven't started with the bot yet.
   * @param {import("eris").Message} message - The message that was sent to the command.
   * @returns {Promise<import("eris").Message>} - The message that was sent to the user.
   */
  startMessage(message: import("eris").Message): Promise<import("eris").Message> {
    return message.send(new this.Embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`))
  }

  /**
   * @description Gets a user from the database.
   * @param userID - The user's id.
   * @param cb - The callback.
   */
  getUser(userID: string, cb: (e: MongoDB.MongoError, u: User) => void): void {
    this.database.Userdata.findOne({ userID: userID }, (e, u) => {
      if (e) {
        return cb(e, null)
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
   * @returns {String} - The formatted amount.
   */
  formatMoney(value: number): string {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    })
    return formatter.format(value).substr(1) + " " + coin
  }

  /**
   * @description Checks if a message used a bot prefix.
   * @param {String} str - The message content to check for the prefix.
   * @returns {(String | false)} Whether or not a prefix was used; if a prefix was used, returns the prefix, else returns false.
   */
  _checkForPrefix(str: string): (string | false) {
    for (const p in this.prefixes) {
      if (str.startsWith(this.prefixes[p])) { return this.prefixes[p] }
    }
    return false
  }

  _checkForFarps(str: string | string[]) {
    return str.includes("farping")
  }

  /**
   * @description Initializes the database.
   */
  async initDB() {
    MongoClient.connect(this.config.db.connectionString, this.config.db.connectionOptions, async (err, db) => {
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