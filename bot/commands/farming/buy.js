import CONSTANTS from "../../lib/CONSTANTS.js";
import { Embed } from "../../lib/Embed.js";
const MAX_PLOTS = 25;
// a Math.round(Math.pow(1.90546071796, i))
export function run(bot) {
    bot.addCommand("buy", (message, _args, userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        if (userdata.farm.length >= MAX_PLOTS) {
            return message.send(new Embed().uhoh(`${message.author.username}, you already have the maximum number of plots!`));
        }
        const numberOfCurrentPlots = userdata.farm.length;
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots + 1));
        const priceOfNextPlotEmbed = new Embed()
            .setTitle("")
            .setDescription(`The next plot costs **${bot.formatMoney(priceOfNextPlot)}!**`)
            .setColor(bot.color.lightgreen);
        return message.send(priceOfNextPlotEmbed);
    }, {
        description: "Show the price of the next farm plot.",
        usage: "farm buy",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 3000
    }).subcommand("confirm", async (message, args, userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        if (userdata.farm.length >= MAX_PLOTS) {
            return message.send(new Embed().uhoh(`${message.author.username}, you already have the maximum number of plots!`));
        }
        const numberOfCurrentPlots = userdata.farm.length;
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots + 1));
        if (userdata.money < priceOfNextPlot) {
            const notEnoughEmbed = new Embed()
                .setTitle("Insufficient Funds!")
                .setDescription(`The next plot costs **${bot.formatMoney(priceOfNextPlot)}.**`)
                .setColor(bot.color.error);
            return message.send(notEnoughEmbed);
        }
        const res = await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
            $push: {
                farm: {
                    crop: {
                        planted: "dirt",
                        datePlantedAt: Date.now()
                    },
                    fertilized: false,
                    watered: false
                }
            },
            $inc: {
                money: -priceOfNextPlot
            }
        });
        if (res.value === undefined) {
            return message.send(new Embed().uhoh("Something went wrong. Please report this in the official farmbot server!"));
        }
        return message.send(new Embed()
            .setDescription(`Plot purchased for **${bot.formatMoney(priceOfNextPlot)}**! You now own ${res.value.farm.length + 1} plots!${res.value.farm.length + 1 === MAX_PLOTS ? " This is the maximum amount of plots!" : ""}`)
            .setColor(bot.color.success));
    }, {
        description: "Buy a new plot for your farm.",
        usage: "farm buy confirm",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 3000
    });
}
