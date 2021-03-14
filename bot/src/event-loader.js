import fs from "fs";
import { join } from "path";
import Log from "./logger.js";
export default (bot) => {
    fs.readdir(join(process.cwd(), "bot/events/"), (err, files) => {
        if (err) {
            return Log.error(err);
        }
        files.forEach(async (file) => {
            const eventFunction = await import(join(process.cwd(), `bot/events/${file}`));
            console.log("eventFunction: ", eventFunction);
            const eventName = file.split(".")[0];
            bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
        });
    });
};
