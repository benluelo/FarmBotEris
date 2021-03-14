import fs from "fs";
import { join } from "path";
import Log from "./logger";
export default (bot) => {
    fs.readdir(join(__dirname, "../events/"), (err, files) => {
        if (err) {
            return Log.error(err);
        }
        files.forEach(async (file) => {
            const eventFunction = await import(join(__dirname, `../events/${file}`));
            const eventName = file.split(".")[0];
            bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
        });
    });
};
