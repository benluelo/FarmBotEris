import ms from "parse-ms";
import parsePlotNumber from "../../lib/parse-plot-number.js";
import { Attachment } from "../../lib/Attachment";
import { Embed } from "../../lib/Embed";
import { ProgressBar } from "../../lib/ProgressBar";
import CONSTANTS from "../../lib/CONSTANTS";
/**
 * @description Clamps a number between two provided values.
 * @param num - The number to clamp.
 * @param min - The minimum value for the number.
 * @param max - The maximum value for the number.
 * @return The clamped number.
 */
function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
export default (bot) => {
    bot.addCommand("info", async (message, args, userdata) => {
        if (args[0]) {
            const plotNumber = parsePlotNumber(args[0]); // plotNumber returns false and NaN depending on the input // doesn't act how you think it will
            if (plotNumber !== undefined) { // this is broken asf
                if (userdata) {
                    if (bot.ENV.DEBUG === "true") {
                        console.log(plotNumber);
                    }
                    if (plotNumber >= userdata.farm.length) {
                        return message.send(new Embed().uhoh("You don't own that plot!"));
                    }
                    else {
                        const userCrop = userdata.farm[plotNumber].crop;
                        if (userCrop.planted == "dirt") {
                            const attachment = new Attachment(userCrop.planted);
                            const infoEmbed = new Embed()
                                .setColor(bot.color.lightgreen)
                                .setTitle(`Info for plot #\`${args[0].toUpperCase()}\``)
                                .setDescription(`There's nothing planted here! Send \`farm plant ${args[0]} <crop>\` to plant a crop on this plot!`)
                                .setThumbnail(attachment.link());
                            return message.send(infoEmbed, attachment);
                        }
                        if (bot.ENV.DEBUG === "true") {
                            console.log(JSON.stringify(userCrop));
                            console.log((Date.now() -
                                userCrop.datePlantedAt) /
                                bot.config.farminfo.growTimes[userCrop.planted]);
                        }
                        const growthPercentage = clamp(((Date.now() -
                            userCrop.datePlantedAt) /
                            bot.config.farminfo.growTimes[userCrop.planted]), 0, 1);
                        if (bot.ENV.DEBUG === "true") {
                            console.log("Time difference:", (Date.now() - userCrop.datePlantedAt));
                            console.log("growthPercentage:", growthPercentage);
                        }
                        // calculate the time until growth
                        let timeUntilPlantFinished;
                        if (0 < bot.config.farminfo.growTimes[userCrop.planted] - (Date.now() - userCrop.datePlantedAt)) {
                            const timeSincePlanted = ms((userCrop.datePlantedAt + bot.config.farminfo.growTimes[userCrop.planted]) - Date.now());
                            timeUntilPlantFinished = `${timeSincePlanted.hours}h ${timeSincePlanted.minutes}m ${timeSincePlanted.seconds}s\n`;
                        }
                        else {
                            timeUntilPlantFinished = "Fully grown!\n";
                        }
                        const p = new ProgressBar(growthPercentage, 1, 10);
                        const growthBar = timeUntilPlantFinished + p.show() + ` ${Math.floor(growthPercentage * 100)}%`;
                        const attachment = new Attachment(userCrop.planted);
                        const infoEmbed = new Embed()
                            .setColor(bot.color.lightgreen)
                            .setTitle(`Info for plot #\`${args[0].toUpperCase()}\``)
                            .setThumbnail(attachment.link());
                        if ("dirt" !== userCrop.planted) {
                            infoEmbed.addField("**Time until grown:**", growthBar);
                        }
                        message.send(infoEmbed, attachment.send());
                    }
                }
                else {
                    bot.startMessage(message);
                }
            }
            else {
                message.send(new Embed().uhoh("Please enter a valid plot format! `<letter><number>`"));
            }
        }
        else {
            message.send(new Embed().uhoh("Please specify the plot you want info on!"));
        }
    }, {
        description: "To show utility on a plot in your farm",
        usage: "​farm info <plot>",
        examples: "​farm info a1",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.UTILITY,
        cooldown: 3000
    });
};
