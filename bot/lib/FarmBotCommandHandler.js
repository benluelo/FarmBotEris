var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _internal;
import util from "util";
import CONSTANTS from "./CONSTANTS.js";
export class CommandInformation {
    /**
     * @description The general information about a command.
     */
    constructor(info) {
        const { description, usage, examples, permissionLevel, category, aliases, cooldown, requiresUser, } = info ?? {};
        this.description = description ?? "No description provided.",
            this.usage = usage ?? "No usage provided.",
            this.examples = examples ?? "",
            this.permissionLevel = permissionLevel ?? CONSTANTS.PERMISSIONS.DEVELOPMENT,
            this.category = category ?? CONSTANTS.CATEGORIES.DEVELOPMENT,
            this.aliases = aliases ?? [],
            this.cooldown = cooldown ?? 0,
            this.requiresUser = requiresUser ?? true;
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
        };
    }
}
export class FarmBotCommand {
    /**
     * @description Makes a command for the bot.
     * @param name - The name of the command.
     * @param func - The command.
     * @param info - The information for the command.
     * @param parent - The parent command, if this is a subcommand.
     */
    constructor(name, func, info, parent) {
        this.name = name;
        this.func = Object.freeze(Object.defineProperty(func, "name", {
            value: name,
            writable: false
        }));
        this.info = info;
        this.parent = parent;
        this.subcommands = new FarmBotCommandHandler();
        this.Cooldowns = new Cooldown(this.getFullCommandName(), this.info.cooldown);
    }
    getFullCommandName() {
        return (this.parent ? this.parent.getFullCommandName() + " " : "") + this.name;
    }
    /**
     * @description Runs the command.
     * @param msg - The message that was sent.
     * @param args - The command arguments.
     * @param userdata - The caller's DB information.
     */
    run(msg, args, userdata) {
        if (this.subcommands.size() !== 0 && this.subcommands.has(args[0])) {
            this.subcommands.get(args.shift())?.run(msg, args, userdata);
        }
        else {
            const timeToWait = this.Cooldowns.check(msg.author.id);
            // FIXME: Better error handling than this big if statement
            if ((this.info.requiresUser && userdata !== undefined && userdata.permissions >= this.info.permissionLevel) || !this.info.requiresUser) {
                this.func(msg, args, undefined);
                if (timeToWait > 0) {
                    const sentMessage = msg.send(`**${msg.author.username}**, you have to wait **${(timeToWait / 1000).toFixed(2)}** seconds to use \`farm ${this.getFullCommandName()}\`!`);
                    msg.delete();
                    setTimeout(async () => { (await sentMessage).delete(); }, timeToWait);
                }
                else {
                    this.func(msg, args, userdata);
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
    subcommand(name, func, info) {
        return this.subcommands.set(name, func, new CommandInformation(info), this);
    }
    /**
     * @description Sets the help embed for the command.
     * @param embed - The help embed for this command.
     */
    setEmbed(embed) {
        this.embed = embed;
    }
    /**
     * @description Gets the help embed for the command.
     * @param args - The name of the command to get the help embed for.
     * @param userdata - The user's DB information.
     * @returns The help embed for this command, or `false` if the `user`'s permmissions aren't high enough.
     */
    getEmbed(args, userdata) {
        if (args[0] && this.subcommands.size() != 0 && this.subcommands.has(args[0])) {
            return this.subcommands.get(args.shift() ?? "")?.getEmbed(args, userdata);
        }
        else {
            if (userdata.permissions < this.info.permissionLevel) {
                return undefined;
            }
            else {
                return this.embed;
            }
        }
    }
    toJSON() {
        return {
            ...this.info.toJSON(),
            subcommands: this.subcommands.size() > 0 ? this.subcommands.toJSON() : undefined,
        };
    }
    // eslint-disable-next-line no-unused-vars
    [util.inspect.custom](_depth, _options) {
        const toReturn = {
            name: this.name,
            info: this.info,
            parent: this.parent ? this.parent.name : null,
            subcommands: this.subcommands.size() > 0 ? this.subcommands : null
        };
        return util.inspect(toReturn, true, 1, true).replace(" [Map] ", " ");
    }
}
export class FarmBotCommandHandler {
    constructor() {
        _internal.set(this, void 0);
        this.size = () => __classPrivateFieldGet(this, _internal).size;
        this.aliases = new Map();
        __classPrivateFieldSet(this, _internal, new Map());
    }
    /**
     * @description Runs thespecified command.
     * @param cmdName - The name of the command to run.
     * @param message - The message that was sent.
     * @param args - The command arguments.
     * @param userdata - The user's DB information.
     */
    run(cmdName, message, args, userdata) {
        this.get(cmdName)?.run(message, args, userdata);
    }
    /**
     * @description Gets a command from the `FarmBotCommandHandler`.
     * @param {string} cmd - The command name.
     * @returns {(FarmBotCommand | undefined)} The found command, or undefined if no command is found.
     */
    get(cmd) {
        return __classPrivateFieldGet(this, _internal).get(cmd) || __classPrivateFieldGet(this, _internal).get(this.aliases.get(cmd) ?? "");
    }
    /**
     * @description Adds a command to the bot.
     * @param name - The command name.
     * @param func - The command function.
     * @param info - The information for the command.
     * @param parent - The parent command, if this is a subcommand.
     * @returns The new `FarmBotCommand` object.
     */
    set(name, func, info, parent) {
        const newCmd = new FarmBotCommand(name, func, info, parent ? parent : undefined);
        if (info && info.aliases) {
            info.aliases.forEach((alias) => {
                this.aliases.set(alias, name);
            });
        }
        __classPrivateFieldGet(this, _internal).set(name, newCmd);
        return newCmd;
    }
    /**
     * @description Checks if a command is in the `FarmBotCommandHandler`.
     * @param cmd - The command to check for.
     * @returns Whether or not the command is in the `FarmBotCommandHandler`.
     */
    has(cmd) {
        return __classPrivateFieldGet(this, _internal).has(cmd) || this.aliases.has(cmd);
    }
    /**
     * @description Gets the help embed for the command.
     * @param args - The name of the command to get the help embed for.
     * @param userdata - The user's DB information.
     * @returns The help embed for this command, or `undefined` if either their permmissions aren't high enough or there is no command with that name.
     */
    getEmbed(args, userdata) {
        return this.has(args[0]) ? this.get(args.shift() ?? "")?.getEmbed(args, userdata) : undefined;
    }
    /**
     * @description Ye.
     * @returns The iterable.
     */
    entries() {
        return __classPrivateFieldGet(this, _internal).entries();
    }
    delete(key) {
        return __classPrivateFieldGet(this, _internal).delete(key);
    }
    toJSON() {
        return Object
            .fromEntries(Array.from(this.entries()).filter(([name, cmd]) => {
            console.log(cmd.info.permissionLevel === CONSTANTS.PERMISSIONS.EVERYONE);
            return cmd.info.permissionLevel === CONSTANTS.PERMISSIONS.EVERYONE;
        }).map(([name, cmd]) => {
            return [name, cmd.toJSON()];
        }));
    }
}
_internal = new WeakMap();
export class Cooldown extends Map {
    constructor(commandName, cooldownTimeMs) {
        super();
        this.commandName = commandName;
        this.cooldownTimeMs = cooldownTimeMs;
    }
    /**
     * @description Checks if a user is able to use a command. If they are able to use it, reset their cooldown for that command.
     * @param {string} userID - The `userID` of the user who is attempting to use the command.
     * @returns {number} How long the user has to wait to use the command, in milliseconds; `0` if the cooldown is up.
     */
    check(userID) {
        // check for the user in the cooldowns
        if (this.has(userID)) {
            /** @description The **T**ime the user has **T**o **W**ait to use the command. */
            let TTW = 0;
            // if the user is in the cooldowns, check if they can use the command
            if ((TTW = this.get(userID)) == 0) {
                // if they can use the command, reset their cooldown for that command
                this.set(userID);
                return 0;
            }
            else {
                // else, return how long they have to wait
                return TTW;
            }
            // if the user isn't in the cooldowns, add them to it
        }
        else {
            this.set(userID);
            return 0;
        }
    }
    /**
     * @description Checks if a user can use a command.
     * @param userID - The user's `userID` to get from the `Cooldowns`.
     * @returns How long the user has to wait to use the command; `0` if the cooldown is up.
     */
    get(userID) {
        const userCooldown = super.get(userID);
        return this._clamp((userCooldown + this.cooldownTimeMs - Date.now()), 0, this.cooldownTimeMs);
    }
    /**
     * @description Adds a user to the `Cooldowns`.
     * @param userID - The user's `userID` to add to the `Cooldowns`.
     * @returns The `Cooldowns` object.
     */
    set(userID) {
        return super.set(userID, Date.now());
    }
    /**
     * @description Checks if a user is in the `Cooldowns`.
     * @param userID - The user's `userID` to check the `Cooldowns` for.
     * @returns Whether or not the user is in the `Cooldowns`.
     */
    has(userID) {
        return super.has(userID);
    }
    /**
     * @description Clamps a number between two provided values.
     * @param num - The number to clamp.
     * @param min - The minimum value for the number.
     * @param max - The maximum value for the number.
     * @returns The clamped number.
     */
    _clamp(num, min, max) {
        return num <= min ? min : num >= max ? max : num;
    }
    [util.inspect.custom](depth, options) {
        if (depth == 0) {
            return options.stylize(`[${this.constructor.name}]`, "special");
        }
        else {
            return this;
        }
    }
}
