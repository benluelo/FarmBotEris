import Log from "../src/logger";
export default async (bot) => {
    bot.editStatus("online", {
        name: `farming in ${bot.guilds.size} servers!`,
        type: 0
    });
    setImmediate(() => {
        Log.connect("Bot Online!");
    });
};
