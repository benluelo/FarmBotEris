import { FarmBotClient } from "./src/lib/FarmBotClient.js";
import { Message } from "eris";
Message.prototype.send = function (content, file) {
    // console.log(JSON.stringify(content, null, 4), file)
    // @ts-ignore the fact that this still works proves otherwise
    return this._client.createMessage(this.channel.id, content, file);
};
import dotenv from "dotenv";
const dotenvParsed = dotenv.config();
if (dotenvParsed.parsed === undefined && dotenvParsed.error !== undefined) {
    throw dotenvParsed.error;
}
const bot = new FarmBotClient(dotenvParsed.parsed, {
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
import { loadCommands } from "./src/loaders/command-loader.js";
import { loadEvents } from "./src/loaders/event-loader.js";
// gonna turn that off for now
// require("../API/index")(bot) // not ideal (bot goes down so does some user pages) but works!
loadCommands(bot);
loadEvents(bot);
bot.initDB()
    .then(_ok => bot.connect())
    .catch(err => console.error(`unable to connect to the database. Error: ${err}`));
