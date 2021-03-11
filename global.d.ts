import { Message } from "eris"

declare module "eris" {
  export interface Message {
    send(content: MessageContent, file?: MessageFile): Promise<Message>;
  }
}

export type CropEmoji = "🍎" | "🍊" | "🍋" | "🍐" | "🍒" | "🍑" | "🥭" | "🍈" | "🍇" | "🍓" | "🍌" | "🍍"
export type CropName = "apple" | "orange" | "lemon" | "pear" | "cherry" | "peach" | "mango" | "melon" | "grapes" | "strawberry" | "banana" | "pineapple"
export type CropColors = "red" | "orange" | "yellow" | "green" | "pink" | "purple"
export type CropFlavours = "sweet" | "sour" | "tart"
export type CropInformation = {
  /** The emoji of the crop. */
  emoji: CropEmoji;
  /** The color of the crop. */
  color: CropColors;
  /** The flavors of the crop. */
  flavour: CropFlavours[];
}

// {\n *emoji: ".*",\n *flavour: \[\n *".*",\n *".*"\n *\],\n *color: ".*"\n *}
export type CropInformationMap = {
  [K in CropName]: CropInformation
}

declare type Plot = {
  crop: {
    /** The crop currently planted on the plot. */
    planted: CropName | "dirt"
    /** The time that the crop was planted at. */
    datePlantedAt: number
  }
  /** Whether or not the plot is fertilized. **Not yet implemented**! */
  fertilized: boolean
  /** Whether or not the plot is watered. **Not yet implemented**! */
  watered: boolean
}

declare type Seed = {
  /** Whether or not the crop has been discovered. */
  discovered: boolean;
  /** The level of the seed (i.e. it's experience level). */
  level: number;
  /** The amount of the seed that the user has in their inventory. */
  amount: number
}
// /\*\*\n\s*\*\s@typedef \{[a-zA-Z]*\} [a-zA-Z]*\n

declare type MarketRequest = {
  /** The name of the farmer who's request this is. */
  name: string;
  /** What the farmer wants. */
  want: {
    /** The crop they want. */
    crop: CropName;
    /** The amount of the crop they want. */
    amount: number;
  }[]
  /** How much they are willing to pay. */
  value: number;
  /** How much reputation filling the request gives. */
  reputation: number;
}

declare type Farmer = {
  /** The name of the Farmer. */
  name: string
  /** The gender of the Farmer. */
  gender: "male" | "female"
  /** The crop that this user will unlock when they hit their unlock level. */
  unlockableCrop: CropName
  /** The wealth of the Farmer. */
  wealth: number
  /** The preferences of the Farmer. */
  preferences: { color: CropColors, taste: CropFlavours[] }
  /** The level of the Farmer (i.e. their experience points). */
  level: number
  /** The level that the farmer will unlock their crop at  (between `5` and `10`). */
  unlockLevel: number
  /** The emoji of the Farmer. */
  emoji: string
}

declare class Embed {
  /** The embed. */
  embed: {
    /** The title of the embed. */
    title?: string
    /** The description of the embed. */
    description?: string
    /** The url of the embed. */
    url?: string
    /** The color of the embed. */
    color?: number
    /** The timestamp of the embed. */
    timestamp?: string
    /** The footer of the embed. */
    footer?: {
      /** The footer icon. */
      icon_url?: string
      /** The footer text. */
      text: string
    }
    /** The embed thumbnail. */
    thumbnail?: {
      /** The url of the thumbnail. */
      url?: string
      /**  */
    }
    /** The embed image. */
    image?: {
      /** The url of the image. */
      url?: string
    }
    /** The author of the embed. */
    author?: {
      /** The author's name. */
      name: string
      /** The url of the author's image. */
      url?: string
      /** The url of the author's icon. */
      icon_url?: string
    }
    /** The fields of the embed. */
    fields?: {
      /** The name of the field. */
      name: string
      /** The content of the field. */
      value: string
      /** Whether or not the field is inline. */
      inline?: boolean
    }[]
  }

  /** Creates a new Embed. */
  constructor(embed?: {
    title?: string,
    description?: string,
    url?: string,
    color?: string,
    timestamp?: string,
    footer?: { icon_url?: string, text?: string },
    thumbnail?: { url?: string },
    image?: { url?: string },
    author?: { name: string, url?: string, icon_url?: string },
    fields?: { name: string, value: string, inline?: boolean }[]
  })
  setTitle(title?: string): this
  setDescription(description?: string): this
  setUrl(url?: (string | URL | Attachment)): this
  setColor(color?: number): this
  setTimestamp(): this
  setFooter(text?: string, icon_url?: string | URL | Attachment): this
  setThumbnail(url?: string | URL | Attachment): this
  setAuthor(name?: string, url?: (string | URL | Attachment), icon_url?: (string | URL | Attachment)): this
  addField(name: string, value: string, inline?: boolean): this
  addBlankField(inline?: boolean): this
  private getURL(obj: (URL | Attachment | string)): string

  /** Send a pre-formatted "uh-oh" message */
  uhoh(
    /** The message to show user. */
    message: string
  ): this

  /** Send a pre-formatted success message */
  success(
    /** The message to show user. */
    message: string
  ): this

  // #endregion Embed methods
}

declare class ProgressBar {
  /** The numerator for the progress bar. */
  private numerator: number
  /** The denominator for the progress bar. */
  private denominator: number
  /** The length of the progress bar in characters. */
  private length: number

  /** Creates a new Progressbar. */
  constructor(numerator: number, denominator: number, length: number)

  show(): string
}

declare class XPProgressBar extends ProgressBar {
  private _level: number
  /** An extension of the {@link ProgressBar} class, for use in showing the levels of the npcs or crops. */
  constructor(
    /** The amount of experience points. Must be `>= 0`. */
    exp: number,
    /** The length of the progress bar, in characters. Default is 10. Must be `>= 2`. */
    length?: number,
    /** The base for the level calculation. Must be `>= 2`. */
    base?: number
  )

  show(): string

  level(): number
}

declare class Attachment {
  crop: CropName
  size: number
  file: Buffer
  name: string
  constructor(crop: CropName, size?: number)

  send(): {
    /** The buffer that contains the attachment. */
    file: Buffer
    /** The name of the file, in the format `attachemnt://<filename>`. */
    name: string
  }

  link(): string
}

declare class NPC {
  /** The name of the NPC. */
  name: string
  /** The gender of the NPC. Either "male" or "female". */
  gender: "male" | "female"
  /** The crop that this user will unlock when they hit their unlock level (between `5` and `10`). */
  unlockableCrop: CropName
  /** The wealth of the NPC. Must be `0 <= x <= 1`. */
  wealth: number
  /** The preferences of the NPC. */
  preferences: { color: CropColors; taste: Readonly<[CropFlavours, CropFlavours]> }
  /** The user's friendship level with the NPC. */
  level: number
  /** The level that the NPC unlocks their crop at. */
  unlockLevel: number
  /** The NPC's emoji. */
  emoji: string
  /** Creates a new NPC. */
  constructor(
    name: string,
    gender?: ("male" | "female"),
    unlockableCrop?: CropName,
    wealth?: number,
    preferences?: {
      color: CropColors
      taste: CropFlavours[]
    }
  )

  /** Creates a new request for the market. */
  newRequest(crops: CropInformationMap): { id: string; req: MarketRequest }

  private getRandomID(): string
}

declare class FarmBotClient extends Eris.Client {
  PERMISSIONS: any
  CATEGORIES: any
  ENV: {
    DEBUG: "true" | undefined
    DEVELOPMENT: "true" | undefined
  }
  prefixes: readonly string[]
  database: any
  _db: any
  Commands: FarmBotCommandHandler
  Cooldowns: Cooldowns
  color: Readonly<{ market: number; darkgreen: number; lightgreen: number; success: number; error: number }>
  log: Log
  Embed: Embed
  ownersIDs: string[]
  config: any

  constructor(dotenv: import("dotenv").DotenvParseOutput, options: Eris.ClientOptions, prefixes: string[])

  /** Adds a command to the bot. */
  addCommand(
    /** The name of the command. */
    name: string,
    /** The command. */
    commandFunction: CommandFunction,
    /** The help information for the command. */
    help?: {
      description?: string
      usage?: string
      examples?: string
      permissionLevel?: (0 | 1 | 2 | 3)
      category?: symbol
      aliases?: string[]
      cooldown?: number
      requiresUser?: boolean
    },
    /** If this is a subcommand, the command that it is a subcommand to. */
    parent?: FarmBotCommand
  ): FarmBotCommand
  /** Sends a message telling the user that they haven't started with the bot yet. */
  startMessage(message: import("eris").Message): Promise<import("eris").Message>
  /** Gets a user from the database. */
  getUser(userID: string, cb: (e: import("mongodb").MongoError, u: User) => Promise<User>): Promise<User>
  /** Formats money for sending to the user. Appends the coin emoji to the end. */
  formatMoney(value: number): string
  /** Checks if a message used a bot prefix. */
  _checkForPrefix(str: string): string | false
  _checkForFarps(str: string): boolean
  /** Initializes the database. */
  initDB(): Promise<void>
}

declare class Log {
  /**
   * @description The default log; logs to the console in cyan.
   */
  static default(...args: []): void
  /**
   * @description Log for when the bot connects; logs to the console in green.
   */
  static connect(...args: []): void
  /**
   * @description Log for when the database connects; logs to the console in lime.
   */
  static dbconnect(...args: []): void
  /**
   * @description Log the commands being loaded into the bot.
   */
  static commandLoad(...args: []): void
  /**
   * @description Log the directory of commands being loaded into the bot.
   */
  static directoryLoad(...args: []): void
  /**
   * @description Log for when there is an error; logs both to a file with the name of the ISO timestamp
   * that the function was called at and to the console (in red).
   */
  static error(...args: []): void
  /**
   * @description Logs to a file for use in long-term debugging and/or statistics. Also logs to the console, in yellow.
   */
  static toFile(...args: []): void
}

declare class User {
  /** The ID of the user. */
  userID: string
  /** The username and discriminator of the user. */
  userTag: string
  nickname: string
  /** The region that the user is in. */
  region: {
    /** The name of the region. */
    name: string;
    /** The flag of the region. */
    flag: string;
  }
  messagesUserSent: number
  botCommandsUsed: number
  /** The amount of money the user has. */
  money: number
  /** The user's farm. */
  farm: Plot[]
  /** The user's seeds. */
  // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
  seeds: { [s: string]: { [s in CropName]: Seed } }
  /** The user's current requests. */
  requests: { [s: string]: MarketRequest }
  /** The farmers in the user's village. */
  farmers: Farmer[]
  /** The farmers in the user's village. */
  permissions: number
  /** When the user's last market refresh was. */
  requestTimeOut: 0
  /** How many new requests the user has left for the hour. */
  requestAmount: 9

  /**
   * @description Creates a new user for the database.
   * @param author The author of the message.
   * @param region The region that the user is farming in.
   * @param farmers The farmers of the user (i.e. their "village").
   */
  constructor(author: Eris.User, region: string, farmers: Farmer[])

  newRequest(returnRequest: boolean): MarketRequest | undefined
}

declare class UserData extends User {
  /**
   * @description Essentially the same as `User`, except it allows for the creation of a `User` object with an existing userdata.
   * @todo Merge `User` and `UserData`.
   * @param author The author of the message.
   * @param userdata The userdata object from the database.
   */
  constructor(author: import("eris").User, userdata: User)
}

declare type CONSTANTS = Readonly<{
  PERMISSIONS: {
    /** Commands that everyone has access to. */
    EVERYONE: 0,
    /** Commands that only bot moderators have access to. */
    MODERATORS: 1,
    /** Commands that only bot admins have access to. */
    OWNERS: 2,
    /** Commands that are only to be used by the developers, during development (i.e. only Ben & Tyler). */
    DEVELOPMENT: 3
  },
  CATEGORIES: {
    /** Commands related to farming. */
    FARMING: symbol,
    /** Useful commands for information about the bot. */
    UTILITY: symbol,
    /** Commands that are only to be used by the owners (i.e. only Ben & Tyler). */
    OWNER: symbol,
    /** Commands used for bot development. */
    DEVELOPMENT: symbol
  }
}>


declare type CommandFunction = (message: import("eris").Message, args: string[], userdata: User) => void

declare class FarmBotCommand {
  name: string;
  func: CommandFunction;
  info: CommandInformation;
  parent?: FarmBotCommand;
  subcommands: FarmBotCommandHandler;
  Cooldowns: Cooldowns;
  embed?: Embed;
  /**
   * @description Makes a command for the bot.
   * @param name The name of the command.
   * @param func The command.
   * @param info The information for the command.
   * @param parent The parent command, if this is a subcommand.
   */
  constructor(name: string, func: CommandFunction, info: CommandInformation, parent?: FarmBotCommand)

  getFullCommandName(): string

  /**
   * @description Runs the command.
   * @param msg The message that was sent.
   * @param args The command arguments.
   * @param userdata The caller's DB information.
   */
  run(msg: import("eris").Message, args: string[], userdata: User): void

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param name The name of the subcommand.
   * @param func The subcommand.
   * @param {{
        description?: string,
        usage?: string,
        examples?: string,
        permissionLevel?: (0 | 1 | 2 | 3),
        category?: Symbol,
        aliases?: string[],
        cooldown?: number,
        requiresUser?: boolean,
      }} info - The information for the command.
   * @returns {FarmBotCommand} The new subcommand object.
   */
  subcommand(name: string, func: CommandFunction, info: { description: string; usage: string; examples: string; permissionLevel: (0 | 1 | 2 | 3); category: symbol; aliases: string[]; cooldown: number; requiresUser: boolean; }): FarmBotCommand

  /**
   * @description Sets the help embed for the command.
   * @param embed The help embed for this command.
   */
  setEmbed(embed: Embed): void

  /**
   * @description Gets the help embed for the command.
   * @param args The name of the command to get the help embed for.
   * @param userdata The user's DB information.
   * @returns {(import("./classes.js").Embed | undefined)} The help embed for this command, or `false` if the `user`'s permmissions aren't high enough.
   */
  getEmbed(args: string[], userdata: User): Embed | undefined
}

declare class FarmBotCommandHandler extends Map<string, FarmBotCommand> {
  /** A map of command aliases to their respective commands. */
  aliases: Map<string, string>
  constructor()

  /**
   * @description Runs thespecified command.
   * @param cmdName The name of the command to run.
   * @param message The message that was sent.
   * @param args The command arguments.
   * @param userdata The user's DB information.
   */
  run(this: FarmBotCommandHandler, cmdName: string, message: import("eris").Message, args: string[], userdata: User): void

  /**
   * @description Gets a command from the `FarmBotCommandHandler`.
   * @param cmd The command name.
   * @returns {(FarmBotCommand | undefined)} The found command, or undefined if no command is found.
   */
  get(cmd: string): FarmBotCommand | undefined

  /**
   * @description Adds a command to the bot.
   * @param name The command name.
   * @param func The command function.
   * @param info The information for the command.
   * @param parent The parent command, if this is a subcommand.
   * @returns {FarmBotCommand} The new `FarmBotCommand` object.
   */
  add(name: string, func: CommandFunction, info: CommandInformation, parent?: FarmBotCommand): FarmBotCommand

  /**
   * @description Checks if a command is in the `FarmBotCommandHandler`.
   * @param cmd The command to check for.
   * @returns {boolean} Whether or not the command is in the `FarmBotCommandHandler`.
   */
  has(cmd: string): boolean

  /**
   * @description Gets the help embed for the command.
   * @param args The name of the command to get the help embed for.
   * @param userdata The user's DB information.
   * @returns {(import("./classes.js").Embed | undefined)} The help embed for this command, or `undefined` if their permmissions aren't high enough or there is no command with that name.
   */
  getEmbed(args: string[], userdata: User): Embed | undefined

  /**
   * @description Ye.
   * @returns {IterableIterator<[string, FarmBotCommand]>} The iterable.
   */
  entries(): IterableIterator<[string, FarmBotCommand]>
}

declare class Cooldowns extends Map {
  name: string
  cooldown: number
  constructor(name: string, cooldown: number)
  /**
   * @description Checks if a user is able to use a command. If they are able to use it, reset their cooldown for that command.
   * @param userID The `userID` of the user who is attempting to use the command.
   * @returns {number} How long the user has to wait to use the command, in milliseconds; `0` if the cooldown is up.
   */
  check(userID: string): number

  /**
   * @description Checks if a user can use a command.
   * @param userID The user's `userID` to get from the `Cooldowns`.
   * @returns {number} How long the user has to wait to use the command; `0` if the cooldown is up.
   */
  get(userID: string): number

  /**
   * @description Adds a user to the `Cooldowns`.
   * @param userID The user's `userID` to add to the `Cooldowns`.
   * @returns {this} The `Cooldowns` object.
   */
  set(userID: string): this

  /**
   * @description Checks if a user is in the `Cooldowns`.
   * @param userID The user's `userID` to check the `Cooldowns` for.
   * @returns {boolean} Whether or not the user is in the `Cooldowns`.
   */
  has(userID: string): boolean

  /**
   * @description Clamps a number between two provided values.
   * @param num The number to clamp.
   * @param min The minimum value for the number.
   * @param max The maximum value for the number.
   * @returns {number} The clamped number.
   */
  _clamp(num: number, min: number, max: number): number
}

declare class CommandInformation {
  description: string;
  usage: string;
  examples: string | null;
  permissionLevel: number;
  category: symbol;
  aliases: string[] | null;
  cooldown: number;
  requiresUser: boolean;
  /**
   * @description The general information about a command.
   * @param {Object} [info]
   * @param {string} [info.description="No description provided."] - The description for the command.
   * @param {string} [info.usage="No usage provided."] - How to use the command.
   * @param {string} [info.examples] - Examples of how to use the command.
   * @param {number} [info.permissionLevel=CONSTANTS.PERMISSIONS.DEVELOPMENT] - The minimum required permission level for the command.
   * @param {symbol} [info.category=CONSTANTS.CATEGORIES.DEVELOPMENT] - The category the command belongs in.
   * @param {string[]} [info.aliases] - An array of aliases for the command.
   * @param {number} [info.cooldown=0] - The cooldown for the command, in `ms`.
   * @param {boolean} [info.requiresUser=true] - Whether or not the command requires a userdata to run. WARNING: If set to `true`, no permissions checks will be made.
   */
  constructor(info: {
    description: string;
    usage: string;
    examples: string | null;
    permissionLevel: number;
    category: symbol;
    aliases: string[] | null;
    cooldown: number;
    requiresUser: boolean;
  })
}