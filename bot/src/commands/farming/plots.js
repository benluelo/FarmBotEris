import chalk from "chalk";
import CONSTANTS from "../../data/CONSTANTS.js";
import cropData from "../../data/crop-data.js";
import { Embed } from "../../lib/Embed.js";
import emoji from "../../json/emoji.json";
export function run(bot) {
    bot.addCommand("plots", (message, _args, userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        // grab farm variable
        const userFarm = userdata.farm;
        // initialize message variables
        let plotsMsg = ""; // top of message (numbers)
        let plotsMsgTop = "<:blank:645355907206742023>"; // rest of message (letters and plots)
        // send message to let the user know the farm is being built, then build the farm
        message.send("Building farm...").then((msg) => {
            for (const plot in userFarm) {
                if (bot.ENV.DEBUG === "true") {
                    console.log(chalk.keyword("brown")("CHECKING PLOT #"), plot);
                }
                /**
                 * @private
                 * Farm format:
                 *   1 2 3 4 5
                 * A * * * * *
                 * B * * * * *
                 * C * * * * *
                 * D * * * * *
                 * E * * * * *
                 */
                // adds the letters and numbers as they are needed
                if (5 > plot) {
                    plotsMsgTop += emoji.numbers[plot];
                }
                if (plot % 5 === 0) {
                    plotsMsg += "\n" + emoji.letters[Math.floor(plot / 5)];
                }
                if (bot.ENV.DEBUG === "true") {
                    console.log(userFarm[plot].crop.planted);
                }
                // adds the plots to the message
                if (userFarm[plot].crop.planted === "dirt") { // if dirt, add dirt (lol)
                    plotsMsg += emoji.dirt;
                }
                else if (Date.now() - userFarm[plot].crop.datePlantedAt >= bot.config.farminfo.growTimes[userFarm[plot].crop.planted]) { // if not dirt, and if the crop is grown, add the crop
                    plotsMsg += cropData[userFarm[plot].crop.planted].emoji;
                }
                else { // if the crop in the plot isn't grown, add a seedling
                    plotsMsg += emoji.seedling;
                }
                if (bot.ENV.DEBUG === "true") {
                    console.log("Now:", Date.now());
                    console.log("Planted at:", userFarm[plot].crop.datePlantedAt);
                    console.log("Time Difference:", (Date.now() - userFarm[plot].crop.datePlantedAt));
                }
            }
            // edit the originally sent message
            msg.edit({
                ...new Embed().setAuthor(`${message.author.username}'s farm!`, undefined, message.author.avatarURL).setDescription(`${plotsMsgTop + plotsMsg}`).setColor(bot.color.lightgreen),
                ...{ content: "" }
            });
        });
    }, {
        description: "Show an overview of your farm.",
        usage: "​farm plots",
        // examples: false,
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 10000
    });
}
