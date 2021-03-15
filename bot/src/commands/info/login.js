import CONSTANTS from "../../data/CONSTANTS.js";
export function run(bot) {
    bot.addCommand("login", async (message, args, userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm login` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        (await message.author.getDMChannel()).createMessage(`http://www.farmbot-discord.com/login/${userdata.uuid}.${userdata.userID}`);
    }, {
        description: "Log in to the FarmBot website.",
        usage: "​farm login",
        // examples: false,
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.UTILITY,
        cooldown: 30000
    });
}
