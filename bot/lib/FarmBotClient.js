import { Client } from "eris";
import { MongoClient } from "mongodb";
import config from "../config";
import Log from "../src/logger";
import { Embed } from "./Embed";
import { coin } from "./emoji.json";
import { FarmBotCommandHandler, CommandInformation } from "./FarmBotCommandHandler";
import User from "./User";
export class FarmBotClient extends Client {
    /**
     * @description Creates an instance of `FarmBotClient`.
     * @param dotenv - The environment variables, containing at least the bot token as `TOKEN`.
     * @param options - The {@link ClientOptions} for the Eris {@link Client}.
     * @param prefixes - An array of the prefixes for the bot.
     */
    constructor(dotenv, options, prefixes) {
        super(dotenv.TOKEN, options);
        this.oneOrMoreSpaces = /\s+/;
        if (!dotenv.TOKEN) {
            throw Error("No bot token!");
        }
        this.ENV = Object.freeze(dotenv);
        this.prefixes = Object.freeze(prefixes);
        this.on("messageCreate", this.onMessageCreate);
        this._db;
        // this.Cooldowns = new Cooldowns()
        this.commands = new FarmBotCommandHandler();
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
        this.ownersIDs = require("../config.js").ownersIDs;
        this.config = Object.freeze(config);
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
        const [commandToRun, ...args] = this._removePrefix(content, prefixUsed).split(this.oneOrMoreSpaces);
        // check if a prefix was used; if a prefix was used, check if a command was used
        const command = this.commands.get(args[0]);
        if (command !== undefined) {
            if (command.info.requiresUser) {
                // if a command was used, check if the caller can use the command
                this.getUser(msg.author.id, (err, userdata) => {
                    if (err) {
                        throw err;
                    }
                    if (!userdata) {
                        this.startMessage(msg);
                    }
                    else {
                        this.commands.run(commandToRun, msg, args, userdata);
                    }
                });
            }
            else {
                this.commands.run(commandToRun, msg, args, undefined);
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
        const newCmd = this.commands.set(name, commandFunction, new CommandInformation(help), parent);
        return newCmd;
    }
    /**
     * @description Sends a message telling the user that they haven't started with the bot yet.
     * @param message - The message that was sent to the command.
     * @returns - The message that was sent to the user.
     */
    startMessage(message) {
        return message.send(new Embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`));
    }
    /**
     * @description Gets a user from the database.
     * @param userID - The user's id.
     * @param callback - The callback.
     */
    getUser(userID, callback) {
        this.database?.Userdata.findOne({ userID: userID }, (err, userdata) => {
            if (err) {
                return callback(err, null);
            }
            if (userdata) {
                return callback(null, User.fromUserData(userdata, userdata.userID));
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
        MongoClient.connect(this.config.db.connectionString, this.config.db.connectionOptions, async (err, db) => {
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
                Log.dbconnect("Successfully connected to database!");
            }
        });
    }
}
