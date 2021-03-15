import Log from "../logger.js";
export function run(bot) {
    bot.editStatus("online", {
        name: `farming in ${bot.guilds.size} servers!`,
        type: 0
    });
    setImmediate(() => {
        Log.connect("Bot Online!");
    });
}
