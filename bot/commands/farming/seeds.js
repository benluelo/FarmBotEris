import cropData from "../../lib/crop-data.js";
import getPriceOfSeeds from "../../lib/get-price-of-seeds.js";
import getLevel from "../../../helpers/level-test.js";
import CONSTANTS from "../../lib/CONSTANTS.js";
import { Embed } from "../../lib/Embed.js";
export default (bot) => {
    bot.addCommand("seeds", (message, _args, userdata) => {
        if (userdata === undefined) {
            // TODO: Better error handling than throwing a generic error
            throw new Error("Command `farm seeds` requires user data.");
        }
        let seeds = "";
        for (const crop in userdata.seeds.common) {
            if (userdata.seeds.common[crop].discovered) {
                const capitalizedCropName = crop.charAt(0).toUpperCase() + crop.slice(1);
                const cropEmoji = cropData[crop].emoji;
                const cropPrice = getPriceOfSeeds[crop] * getLevel(2, userdata.seeds.common[crop].level).level;
                // i hate this long line lol
                seeds += `${cropEmoji} ${capitalizedCropName}: **${bot.formatMoney(cropPrice)}**\n`;
            }
        }
        return message.send(new Embed()
            .setTitle(`**${message.author.username}'s** seedbag!`)
            .setDescription("Prices update every hour!\n" + seeds)
            .setColor(bot.color.lightgreen)
            .setTimestamp());
    }, {
        description: "Look into your seed bag, and check the value for each crop you have.",
        usage: "​farm seeds",
        // examples: false,
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        aliases: ["seedbag"],
        cooldown: 3000
    });
};
