import CONSTANTS from "../../lib/CONSTANTS.js";
import { Embed } from "../../lib/Embed.js";
export function run(bot) {
    // eslint-disable-next-line no-unused-vars
    bot.addCommand("stop", (message, _args, _userdata) => {
        const stopEmbed = new Embed()
            .setTitle("Stopping Bot")
            .setDescription(`${bot.user.username} disconnecting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
            .setColor(bot.color.error);
        message.send(stopEmbed);
        setTimeout(() => { bot.disconnect({ reconnect: false }); process.exit(0); }, 5000);
    }, {
        description: "Stops the bot.",
        usage: "​farm stop",
        examples: "​farm stop",
        permissionLevel: CONSTANTS.PERMISSIONS.OWNERS,
        category: CONSTANTS.CATEGORIES.UTILITY,
        aliases: ["assassinate"],
        cooldown: 0
        // eslint-disable-next-line no-unused-vars
    }).subcommand("restart", (message, _args, _userdata) => {
        const restartEmbed = new Embed()
            .setTitle("Restarting Bot")
            .setDescription(`${bot.user.username} restarting in 5 seconds\n**${bot.guilds.size}** servers\n**${bot.users.size}** users`)
            .setColor(bot.color.error);
        message.send(restartEmbed);
        setTimeout(() => { bot.disconnect({ reconnect: true }); }, 10000);
    }, {
        description: "Restarts the bot",
        usage: "​farm stop restart",
        examples: "​farm stop restart",
        permissionLevel: CONSTANTS.PERMISSIONS.OWNERS,
        category: CONSTANTS.CATEGORIES.UTILITY,
        aliases: ["resurect"],
        cooldown: 0
    });
}
