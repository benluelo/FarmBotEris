import { inspect, InspectOptionsStylized } from "util"
import { CONSTANTS } from "./CONSTANTS"
import { User } from "./user"
import type { Embed } from "./classes"
import type * as Eris from "eris"

export type CommandFunction = (message: Eris.Message, args: string[], userdata?: User) => void

export interface CommandInformationConstructor {
  /** The description for the command. */
  description: string;
  /** How to use the command. */
  usage: string;
  /** Examples of how to use the command. */
  examples?: string;
  /** */
  permissionLevel: number;
  /** The category the command belongs in. */
  category: symbol;
  /** An array of aliases for the command. */
  aliases?: string[];
  /** The cooldown for the command, in `ms`. */
  cooldown: number;
  /** Whether or not the command requires a userdata to run. WARNING: If set to `true`, no permissions checks will be made. */
  requiresUser: boolean;
}

export class CommandInformation {
  description: string
  usage: string
  examples: string
  permissionLevel: number
  category: symbol
  aliases: string[]
  cooldown: number
  requiresUser: boolean
  /**
   * @description The general information about a command.
   */
  constructor(info: CommandInformationConstructor = {
    description: "No description provided.",
    usage: "No usage provided.",
    examples: undefined,
    permissionLevel: CONSTANTS.PERMISSIONS.DEVELOPMENT,
    category: CONSTANTS.CATEGORIES.DEVELOPMENT,
    aliases: undefined,
    cooldown: 0,
    requiresUser: true
  }) {
    this.description = info.description
    this.usage = info.usage
    this.examples = info.examples
    this.permissionLevel = info.permissionLevel
    this.category = info.category
    this.aliases = info.aliases
    this.cooldown = info.cooldown
    this.requiresUser = info.requiresUser
  }

  toJSON() {
    return {
      description: this.description,
      usage: this.usage,
      examples: this.examples,
      permissionLevel: this.permissionLevel,
      category: this.category.description,
      aliases: this.aliases,
      cooldown: this.cooldown
    }
  }
}

export class FarmBotCommand {
  subcommands: FarmBotCommandHandler
  Cooldowns: Cooldowns
  embed: Embed
  /**
   * @description Makes a command for the bot.
   * @param name - The name of the command.
   * @param func - The command.
   * @param info - The information for the command.
   * @param [parent] - The parent command, if this is a subcommand.
   */
  constructor(private name: string, private func: CommandFunction, public info: CommandInformation, private parent: FarmBotCommand) {
    this.name = name
    this.func = Object.freeze(Object.defineProperty(func, "name", {
      value: name,
      writable: false
    }))
    this.info = info
    this.parent = parent
    this.subcommands = new FarmBotCommandHandler()
    this.Cooldowns = new Cooldowns(this.getFullCommandName(), this.info.cooldown)
  }

  getFullCommandName(): string {
    return (this.parent ? this.parent.getFullCommandName() + " " : "" ) + this.name
  }

  /**
   * @description Runs the command.
   * @param msg - The message that was sent.
   * @param args - The command arguments.
   * @param userdata - The caller's DB information.
   */
  run(msg: Eris.Message, args: string[], userdata: User) {
    if (this.subcommands.size != 0 && this.subcommands.has(args[0])) {
      this.subcommands.get(args.shift()).run(msg, args, userdata)
    } else {
      if (this.info.requiresUser && userdata.permissions < this.info.permissionLevel) { return }
      if (!this.info.requiresUser) {
        this.func(msg, args)
      } else {
        const TTW = this.Cooldowns.check(msg.author.id)
        if (TTW > 0) {
          const m = msg.send(`**${msg.author.username}**, you have to wait **${(TTW / 1000).toFixed(2)}** seconds to use \`farm ${this.getFullCommandName()}\`!`)
          msg.delete()
          setTimeout(async () => { (await m).delete() }, TTW)
        } else {
          this.func(msg, args, userdata)
        }
      }
    }
  }

  /**
   * @description Makes a subcommand for the bot, attached to the specified command.
   * @param name - The name of the subcommand.
   * @param func - The subcommand.
   * @param info - The information for the command.
   * @returns The new subcommand object.
   */
  subcommand(name: string, func: CommandFunction, info: CommandInformationConstructor): FarmBotCommand {
    return this.subcommands.set(name, func, new CommandInformation(info), this)
  }

  /**
   * @description Sets the help embed for the command.
   * @param embed - The help embed for this command.
   */
  setEmbed(embed: Embed) {
    this.embed = embed
  }

  /**
   * @description Gets the help embed for the command.
   * @param args - The name of the command to get the help embed for.
   * @param userdata - The user's DB information.
   * @returns The help embed for this command, or `false` if the `user`'s permmissions aren't high enough.
   */
  getEmbed(args: string[], userdata: User): (Embed | undefined) {
    console.log(this.name, args)
    if (args[0] && this.subcommands.size != 0 && this.subcommands.has(args[0])) {
      return this.subcommands.get(args.shift()).getEmbed(args, userdata)
    } else {
      if (userdata.permissions < this.info.permissionLevel) { return undefined }
      else { return this.embed }
    }
  }

  toJSON() {
    const toReturn: any = {
      ...this.info.toJSON()
    }

    if (this.subcommands.size > 0) {
      toReturn.subcommands = this.subcommands.toJSON()
    }

    return toReturn
  }

  // eslint-disable-next-line no-unused-vars
  [inspect.custom](_depth: number, _options: InspectOptionsStylized) {
    const toReturn: any = {
      name: this.name,
      info: this.info
    }
    this.parent ? toReturn.parent = this.parent.name : null,
    this.subcommands.size > 0 ? toReturn.subcommands = this.subcommands : null
    return inspect(toReturn, true, 1, true).replace(" [Map] ", " ")
  }
}

export class FarmBotCommandHandler extends Map {
  /** A map of command aliases to their respective commands. */
  aliases: Map<string, string>
  constructor() {
    super()
    this.aliases = new Map()
  }

  /**
   * @description Runs thespecified command.
   * @param cmdName - The name of the command to run.
   * @param message - The message that was sent.
   * @param args - The command arguments.
   * @param userdata - The user's DB information.
   */
  run(cmdName: string, message: Eris.Message, args: string[], userdata?: User) {
    this.get(cmdName).run(message, args, userdata)
  }

  /**
   * @description Gets a command from the `FarmBotCommandHandler`.
   * @param cmd - The command name.
   * @returns The found command, or undefined if no command is found.
   */
  get(cmd: string): (FarmBotCommand | undefined) {
    return super.get(cmd) || super.get(this.aliases.get(cmd))
  }

  /**
   * @description Adds a command to the bot.
   * @param name - The command name.
   * @param func - The command function.
   * @param info - The information for the command.
   * @param [parent] - The parent command, if this is a subcommand.
   * @returns The new `FarmBotCommand` object.
   */
  set(name: string, func: CommandFunction, info: CommandInformation, parent: FarmBotCommand): FarmBotCommand {
    const newCmd = new FarmBotCommand(name, func, info, parent ? parent : null)
    if (info && info.aliases) {
      info.aliases.forEach((alias) => {
        this.aliases.set(alias, name)
      })
    }
    super.set(name, newCmd)
    return newCmd
  }

  /**
   * @description Checks if a command is in the `FarmBotCommandHandler`.
   * @param cmd - The command to check for.
   * @returns Whether or not the command is in the `FarmBotCommandHandler`.
   */
  has(cmd: string): boolean {
    return super.has(cmd) || this.aliases.has(cmd)
  }

  /**
   * @description Gets the help embed for the command.
   * @param args - The name of the command to get the help embed for.
   * @param userdata - The user's DB information.
   * @returns The help embed for this command, or `undefined` if their permmissions aren't high enough or there is no command with that name.
   */
  getEmbed(args: string[], userdata: User): (Embed | undefined) {
    console.log(args)
    return this.has(args[0]) ? this.get(args.shift()).getEmbed(args, userdata) : undefined
  }

  /**
   * @description Ye.
   * @returns The iterable.
   */
  entries(): IterableIterator<[string, FarmBotCommand]> {
    return super.entries()
  }

  toJSON() {
    return Object
      .fromEntries(
        Array.from(
          this.entries()
        ).filter(([name, cmd]) => {
          return cmd.info.permissionLevel === CONSTANTS.PERMISSIONS.EVERYONE
        }).map(([name, cmd]) => {
          return [name, cmd.toJSON()]
        })
      )
  }
}

export class Cooldowns extends Map {
  constructor(private name: string, private cooldown: number) {
    super()
  }

  /**
   * @description Checks if a user is able to use a command. If they are able to use it, reset their cooldown for that command.
   * @param userID - The `userID` of the user who is attempting to use the command.
   * @returns How long the user has to wait to use the command, in milliseconds; `0` if the cooldown is up.
   */
  check(userID: string): number {
    // check for the user in the cooldowns
    if (this.has(userID)) {
      /** @description The **T**ime the user has **T**o **W**ait to use the command. */
      let TTW = 0
      // if the user is in the cooldowns, check if they can use the command
      if ((TTW = this.get(userID)) == 0) {
        // if they can use the command, reset their cooldown for that command
        this.set(userID)
        return 0
      } else {
        // else, return how long they have to wait
        return TTW
      }
    // if the user isn't in the cooldowns, add them to it
    } else {
      this.set(userID)
      return 0
    }
  }

  /**
   * @description Checks if a user can use a command.
   * @param userID - The user's `userID` to get from the `Cooldowns`.
   * @returns How long the user has to wait to use the command; `0` if the cooldown is up.
   */
  get(userID: string): number {
    const t = super.get(userID)
    const cd = this.cooldown
    return this._clamp((t + cd - Date.now()), 0, cd)
  }

  /**
   * @description Adds a user to the `Cooldowns`.
   * @param userID - The user's `userID` to add to the `Cooldowns`.
   * @returns The `Cooldowns` object.
   */
  set(userID: string): this {
    return super.set(userID, Date.now())
  }

  /**
   * @description Checks if a user is in the `Cooldowns`.
   * @param userID - The user's `userID` to check the `Cooldowns` for.
   * @returns Whether or not the user is in the `Cooldowns`.
   */
  has(userID: string): boolean {
    return super.has(userID)
  }

  /**
   * @description Clamps a number between two provided values.
   * @param num - The number to clamp.
   * @param min - The minimum value for the number.
   * @param max - The maximum value for the number.
   * @returns The clamped number.
   */
  _clamp(num: number, min: number, max: number): number {
    return num <= min ? min : num >= max ? max : num
  }

  [inspect.custom](depth: number, options: InspectOptionsStylized) {
    if (depth == 0) {
      return options.stylize(`[${this.constructor.name}]`, "special")
    } else {
      return this
    }
  }
}