import { isValidCropName } from "../../../helpers/isValidCropName.js";
import CONSTANTS from "../../lib/CONSTANTS.js";
import cropData from "../../lib/crop-data.js";
import { Embed } from "../../lib/Embed.js";
import { parsePlotNumber } from "../../lib/parse-plot-number.js";
export function run(bot) {
    const cmd = bot.addCommand("plant", async (message, [plot, crop, ...args], userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        // check specified plot
        if (plot === undefined) {
            return message.send(new Embed().uhoh("You have to specify a plot to plant on!"));
        }
        if (crop !== undefined && plot !== undefined) {
            // check if input is valid
            const plotNumber = parsePlotNumber(plot);
            if (!cropData[crop] || !userdata.seeds.common[crop].discovered) {
                return message.send(new Embed().uhoh("Please include a valid plant type"));
            }
            if (undefined !== plotNumber) {
                if (plotNumber >= userdata.farm.length) {
                    return message.send(new Embed().uhoh("You don't own that plot!"));
                }
                if ("dirt" != userdata.farm[plotNumber].crop.planted) {
                    return message.send(new Embed().uhoh(`There's already a crop planted on plot #\`${plot}\`!`));
                }
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
                    $set: {
                        [`farm.${plotNumber}.crop.planted`]: crop,
                        [`farm.${plotNumber}.crop.datePlantedAt`]: Date.now()
                    }
                });
                return message.send(new Embed().success(`Planted ${cropData[crop].emoji} on \`${plot.charAt(0).toUpperCase() + plot.slice(1)}\`!`));
            }
            else {
                return message.send(new Embed().uhoh("Invalid input! Please try again with the format `<letter><number> <plant>`."));
            }
        }
        else {
            return message.send(new Embed().uhoh("You have to specify a crop to plant!"));
        }
    }, {
        description: "Plants a seed on the specified plot.",
        usage: "​farm plant <plot> <seed>",
        examples: "​farm plant a1 apple",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 5000
    });
    cmd.subcommand("all", async (message, args, userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        const crop = args[0];
        if (!crop) {
            return message.send(new Embed().uhoh("Please specify the crop you want to plant!"));
        }
        if (!cropData[crop] || !userdata.seeds.common[crop].discovered) {
            return message.send(new Embed().uhoh(`Couldn't find **${crop}** seeds in your seedbag... maybe you mispelled it?`));
        }
        const msg = await message.send("Planting all!");
        let totalPlots = 0;
        for (const plot in userdata.farm) {
            if (userdata.farm[plot].crop.planted === "dirt") {
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
                    $set: {
                        [`farm.${plot}.crop.planted`]: crop,
                        [`farm.${plot}.crop.datePlantedAt`]: Date.now()
                    }
                });
                totalPlots++;
            }
        }
        if (totalPlots == 0) {
            return msg.edit({
                content: "",
                ...new Embed().uhoh(`There's no more room in your field to plant anything else, **${message.author.username}!**`)
            });
        }
        return await msg.edit({
            content: "",
            ...new Embed().success(`Successfully planted **${totalPlots}** ${cropData[crop].emoji}!`)
        });
    }, {
        description: "Plants a seed on all available plots.",
        usage: "​farm plant all <seed>",
        examples: "​farm plant all apple",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 5000
    });
    cmd.subcommand("row", async (message, [row, crop, ...args], userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm plant row` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        if ((row === undefined) || (crop === undefined)) {
            return message.send(new Embed().uhoh("Uh-oh! See `farm help plant row` for help on how to use this command."));
        }
        const rows = {
            a: 0,
            b: 5,
            c: 10,
            d: 15,
            e: 20
        };
        function isValidRow(r) {
            return rows.hasOwnProperty(r);
        }
        if (!isValidRow(row)) {
            return message.send(new Embed().uhoh(`**${row.toUpperCase()}** isn't a valid row. Options are **${Object.keys(rows).join(", ")}**`));
        }
        if (!isValidCropName(crop) || !userdata.seeds.common[crop].discovered) {
            return message.send(new Embed().uhoh(`**${crop}** isn't a valid crop!`));
        }
        if (userdata.farm.length < rows[row]) {
            return message.send(new Embed().uhoh(`You don't own any plots on row **${row.toUpperCase()}**`));
        }
        let totalPlots = 0;
        for (let plot = rows[row]; (plot < rows[row] + 5) && (plot < userdata.farm.length); ++plot) {
            console.log(plot, userdata.farm[plot].crop);
            if (userdata.farm[plot].crop.planted === "dirt") {
                await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
                    $set: {
                        [`farm.${plot}.crop.planted`]: crop,
                        [`farm.${plot}.crop.datePlantedAt`]: Date.now()
                    }
                });
                totalPlots++;
            }
        }
        if (totalPlots == 0) {
            return message.send(new Embed().uhoh(`There's no more room on row **${row.toUpperCase()}** to plant anything else, **${message.author.username}!**`));
        }
        return message.send(new Embed().success(`Successfully planted **${totalPlots}** ${cropData[crop].emoji} on row **${row.toUpperCase()}**!`));
    }, {
        description: "Plants a seed on all available plots in the specified row.",
        usage: "​farm plant row <row> <seed>",
        examples: "​farm plant row a apple",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 5000
    });
}
