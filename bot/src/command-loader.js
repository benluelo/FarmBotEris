import fs from "fs";
import path from "path";
import Log from "./logger.js";
let helpLocation = "";
export default async (bot) => {
    loadCommands(bot, path.join(process.cwd(), "bot/commands"));
    (await import(helpLocation)).getHelp(bot);
};
/**
 * @description Load all of the commands found in `bot/commands`, recursively.
 * @param bot - The bot variable.
 * @param dirpath - The path to the current file.
 * @param depth - The depth of the recursion when looking for commands to load.
 */
function loadCommands(bot, dirpath, depth = 0) {
    const p = dirpath;
    fs.readdirSync(p).forEach(async (file, key, arr) => {
        if (!fs.lstatSync(`${p}/${file}`).isDirectory()) {
            const [name, ext] = file.split(".");
            if (ext == "js") {
                if (name == "help") {
                    if (helpLocation != "") {
                        throw new Error(`Two commands/ subcommands share the name "help":\n  ${helpLocation}\n  ${`${p}/${file}`}`);
                    }
                    helpLocation = `${p}/${file}`;
                }
                const a = await import(`${p}/${file}`); /* .run(bot) */
                console.log(a);
                Log.commandLoad(Object.is(arr.length - 1, key) ? `${"│  ".repeat(depth)}└──>` : `${"│  ".repeat(depth)}├──>`, file);
            }
        }
        else {
            Log.directoryLoad(`├──${"┼──".repeat(depth)}┬ Loading ${file} commands...`);
            loadCommands(bot, `${p}/${file}`, depth + 1);
        }
    });
}
