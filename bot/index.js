"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FarmBotClient_1 = require("./lib/FarmBotClient");
const eris_1 = require("eris");
eris_1.Message.prototype.send = function (content, file) {
    // @ts-ignore the fact that this still works proves otherwise
    return this._client.createMessage(this.channel.id, content, file);
};
const bot = new FarmBotClient_1.FarmBotClient(require("dotenv").config().parsed, {
    disableEveryone: true,
    defaultImageFormat: "png",
    disableEvents: {
        CHANNEL_DELETE: true,
        CHANNEL_UPDATE: true,
        GUILD_BAN_ADD: true,
        GUILD_BAN_REMOVE: true,
        GUILD_ROLE_CREATE: true,
        GUILD_ROLE_DELETE: true,
        GUILD_ROLE_UPDATE: true,
        MESSAGE_DELETE: true,
        MESSAGE_DELETE_BULK: true,
        PRESENCE_UPDATE: true,
        TYPING_START: true,
        VOICE_STATE_UPDATE: true
    }
}, [
    "farm",
    "f!"
]);
require("./src/command-loader.js")(bot);
require("./src/event-loader.js")(bot);
// gonna turn that off for now
// require("../API/index")(bot) // not ideal (bot goes down so does some user pages) but works!
bot.initDB();
bot.connect();
