"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = require("eris");
const mongodb_1 = require("mongodb");
const { coin } = require("../lib/emoji.json");
const { FarmBotCommandHandler, CommandInformation } = require("./FarmBotCommandHandler.js");
// const Cooldowns = require("./FarmBotCooldown.js")
class FarmBotClient extends eris_1.Client {
    /**
     * @description Creates an instance of `FarmBotClient`.
     * @param {import("dotenv").DotenvParseOutput} dotenv - The environment variables, containing at least the bot token as `TOKEN`.
     * @param {import("eris").ClientOptions} options - The {@link import("eris").ClientOptions} for the `FarmBotClient`.
     * @param {String[]} prefixes - An array of the prefixes for the bot.
     */
    constructor(dotenv, options, prefixes) {
        if (!dotenv.TOKEN) {
            throw Error("No bot token!");
        }
        super(dotenv.TOKEN, options);
        /** @description The different permission levels for a command. */
        this.PERMISSIONS = require("./CONSTANTS.js").PERMISSIONS;
        /** @description The different categories of commands. */
        this.CATEGORIES = require("./CONSTANTS.js").CATEGORIES;
        this.ENV = Object.freeze(dotenv);
        this.prefixes = Object.freeze(prefixes);
        this.on("messageCreate", this.onMessageCreate);
        this._db;
        // this.Cooldowns = new Cooldowns()
        this.Commands = new FarmBotCommandHandler();
        /**
         * @description The different colors for the bot.
         */
        this.color = Object.freeze({
            market: 0x964b00,
            darkgreen: 0x004C00,
            lightgreen: 0x00FF00,
            success: 0x00FF00,
            error: 0xFF0000
        });
        this.log = require("../src/logger.js");
        /** @description The Embed class, used for making new embeds. */
        this.Embed = require("./classes.js").Embed;
        this.ownersIDs = require("../config.js").ownersIDs;
        this.config = Object.freeze(require("../config.js"));
    }
    /**
     * @description Ye.
     * @param msg - The message from the messageCreate event.
     */
    async onMessageCreate(msg) {
        if (msg.author.bot) {
            return;
        }
        const content = msg.content.toLowerCase();
        const prefixUsed = this._checkForPrefix(content);
        if (!prefixUsed) {
            return;
        }
        const args = this._removePrefix(content, prefixUsed).split(/\s+/);
        // check if a prefix was used; if a prefix was used, check if a command was used
        if (this.Commands.has(args[0])) {
            if (this.Commands.get(args[0]).info.requiresUser) {
                // if a command was used, check if the caller can use the command
                this.getUser(msg.author.id, (err, userdata) => {
                    if (err) {
                        throw err;
                    }
                    if (!userdata) {
                        this.startMessage(msg);
                    }
                    else {
                        this.Commands.run(args.shift(), msg, args, userdata);
                    }
                });
            }
            else {
                this.Commands.run(args.shift(), msg, args);
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
    addCommand(name, commandFunction, help, parent) {
        const newCmd = this.Commands.set(name, commandFunction, new CommandInformation(help), parent);
        return newCmd;
    }
    /**
     * @description Sends a message telling the user that they haven't started with the bot yet.
     * @param message - The message that was sent to the command.
     * @returns - The message that was sent to the user.
     */
    startMessage(message) {
        return message.send(new this.Embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`));
    }
    /**
     * @description Gets a user from the database.
     * @param userID - The user's id.
     * @param callback - The callback.
     */
    getUser(userID, callback) {
        this.database?.Userdata.findOne({ userID: userID }, (err, user) => {
            if (err) {
                return callback(err, null);
            }
            if (user) {
                return callback(null, user);
            }
            else {
                return callback(null, null);
            }
        });
    }
    /**
     * @description Formats money for sending to the user. Appends the coin emoji to the end.
     * @param value - The amount you want to format as money.
     * @returns - The formatted amount.
     */
    formatMoney(value) {
        const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        });
        return formatter.format(value).substr(1) + " " + coin;
    }
    /**
     * @description Checks if a message used a bot prefix.
     * @param str - The message content to check for the prefix.
     * @returns Whether or not a prefix was used; if a prefix was used, returns the prefix, else returns false.
     */
    _checkForPrefix(str) {
        for (const prefix in this.prefixes) {
            if (str.startsWith(this.prefixes[prefix])) {
                return this.prefixes[prefix];
            }
        }
        return false;
    }
    _removePrefix(str, prefix) {
        return str.substr(prefix.length).trim();
    }
    _checkForFarps(str) {
        return str.includes("farping");
    }
    /**
     * @description Initializes the database.
     */
    async initDB() {
        mongodb_1.MongoClient.connect(this.config.db.connectionString, this.config.db.connectionOptions, async (err, db) => {
            if (err) {
                throw err;
            }
            if (this._db) {
                if (process.env.DEBUG === "true") {
                    console.warn("trying to init DB again!");
                }
            }
            this._db = db;
            if (db) {
                this.database = {
                    db,
                    Userdata: db.db("farmbot").collection("farm"),
                };
                this.log.dbconnect("Successfully connected to database!");
            }
        });
    }
}
module.exports = FarmBotClient;
