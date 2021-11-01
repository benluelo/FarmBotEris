import type { DotenvParseOutput } from 'dotenv/types';
import { Client, ClientOptions, Message } from 'eris';
import mongodb from 'mongodb';
import type { Collection, MongoError, MongoClient } from 'mongodb';
// const { MongoClient } = mongodb
import { config } from '../../config.js';
import Log from '../logger.js';
import { Embed } from './Embed.js';
import { FarmBotCommandHandler, CommandInformation, CommandFunction, FarmBotCommand } from './FarmBotCommandHandler.js';
import User from './User.js';
import { UserData } from '../dtos/UserData.js';

export type CommandHelp = {
  description?: string
  usage?: string
  examples?: string
  permissionLevel?: (0 | 1 | 2 | 3)
  category?: symbol
  aliases?: string[]
  cooldown?: number
  requiresUser?: boolean
};

export class FarmBotClient extends Client {
  ENV: Readonly<DotenvParseOutput>;
  prefixes: readonly string[];
  database?: {
    db: MongoClient,
    Userdata: Collection<UserData>,
  };
  color: Readonly<{
    market: number;
    darkgreen: number;
    lightgreen: number;
    success: number;
    error: number
  }>;
  readonly ownersIDs: readonly [string, string];
  config: typeof config;
  commands: FarmBotCommandHandler;
  private readonly oneOrMoreSpaces = /\s+/;
  // DB is initialized before client ever connects
  private _db!: mongodb.MongoClient;

  /**
   * @description Creates an instance of `FarmBotClient`.
   * @param dotenv - The environment variables, containing at least the bot token as `TOKEN`.
   * @param options - The {@link ClientOptions} for the Eris {@link Client}.
   * @param prefixes - An array of the prefixes for the bot.
   */
  constructor(dotenv: DotenvParseOutput, options: ClientOptions, prefixes: string[]) {
    super(dotenv.TOKEN, options);
    if (!dotenv.TOKEN) { throw Error('No bot token!'); }

    this.ENV = Object.freeze(dotenv);

    this.prefixes = Object.freeze(prefixes);

    this.on('messageCreate', this.onMessageCreate);

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

    this.ownersIDs = config.ownersIDs;

    this.config = Object.freeze(config);
  }

  /**
   * @description Ye.
   * @param msg - The message from the messageCreate event.
   */
  async onMessageCreate(msg: Message): Promise<void> {
    if (msg.author.bot) { return; }

    const content = msg.content.toLowerCase();

    const prefixUsed = this._checkForPrefix(content);

    if (!prefixUsed) { return; }

    const [commandToRun, ...args] = this._removePrefix(msg.content, prefixUsed).split(this.oneOrMoreSpaces);

    // check if a prefix was used; if a prefix was used, check if a command was used
    const command = this.commands.get(commandToRun);
    if (command !== undefined) {
      if (command.info.requiresUser) {
        // if a command was used, check if the caller can use the command
        this.getUser(msg.author.id, (err, userdata) => {
          if (err) { throw err; }
          if (!userdata) {
            this.startMessage(msg);
          } else {
            this.commands.run(commandToRun, msg, args, userdata as UserData);
          }
        });
      } else {
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
  addCommand(name: string, commandFunction: CommandFunction, help: CommandHelp, parent?: FarmBotCommand): FarmBotCommand {
    const newCmd = this.commands.set(name, commandFunction, new CommandInformation(help), parent);
    return newCmd;
  }

  /**
   * @description Sends a message telling the user that they haven't started with the bot yet.
   * @param message - The message that was sent to the command.
   * @returns - The message that was sent to the user.
   */
  startMessage(message: Message): Promise<Message> {
    return message.send(new Embed().uhoh(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`));
  }

  /**
   * @description Gets a user from the database.
   * @param userID - The user's id.
   * @param callback - The callback.
   */
  getUser(userID: string, callback: (err: MongoError | null, user: User | null) => void): void {
    this.database?.Userdata.findOne({ userID: userID }, (err, userdata) => {
      if (err) {
        return callback(err, null);
      }

      if (userdata) {
        return callback(null, User.fromUserData(userdata, userdata.userID));
      } else {
        return callback(null, null);
      }
    });
  }

  /**
   * @description Checks if a message used a bot prefix.
   * @param str - The message content to check for the prefix.
   * @returns Whether or not a prefix was used; if a prefix was used, returns the prefix, else returns false.
   */
  _checkForPrefix(str: string): string | false {
    for (const prefix in this.prefixes) {
      if (str.startsWith(this.prefixes[prefix])) {
        return this.prefixes[prefix];
      }
    }
    return false;
  }

  _removePrefix(str: string, prefix: string): string {
    return str.substr(prefix.length).trim();
  }

  _checkForFarps(str: string): boolean {
    return str.includes('farping');
  }

  /**
   * @description Initializes the database.
   */
  async initDB(): Promise<void> {
    mongodb.MongoClient.connect(this.config.db.connectionString, this.config.db.connectionOptions, async (err, client) => {
      if (err) { throw err; }

      if (this._db) {
        if (process.env.DEBUG === 'true') { console.warn('trying to init DB again!'); }
      }
      this._db = client;
      if (client) {
        this.database = {
          db: client,
          Userdata: client.db('farmbot').collection('farm'),
        };
        Log.dbconnect('Successfully connected to database!');
      }
    });
  }
}
