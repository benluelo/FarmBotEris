"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_js_1 = require("../../../global.js");
const crop_data_js_1 = __importDefault(require("../../lib/crop-data.js"));
const getPriceOfSeeds = require("../../lib/get-price-of-seeds");
const { getLevel } = require("../../../helpers/level-test.js");
/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
    bot.addCommand("seeds", (message, _args, userdata) => {
        // console.log(userdata)
        console.log(crop_data_js_1.default);
        let seeds = "";
        for (const crop in userdata.seeds.common) {
            if (userdata.seeds.common[crop].discovered) {
                // i hate this long line lol
                seeds += `${crop_data_js_1.default[crop].emoji} ${crop.charAt(0).toUpperCase() + crop.slice(1)}: **${bot.formatMoney(getPriceOfSeeds[crop] * getLevel(userdata.seeds.common[crop].level).level)}**\n`;
            }
        }
        return message.send(new global_js_1.Embed()
            .setTitle(`**${message.author.username}'s** seedbag!`)
            .setDescription("Prices update every hour!\n" + seeds)
            .setColor(bot.color.lightgreen)
            .setTimestamp());
    }, {
        description: "To get all the seeds and their prices that they sell for per seed",
        usage: "​farm seeds",
        // examples: false,
        permissionLevel: bot.PERMISSIONS.EVERYONE,
        category: bot.CATEGORIES.FARMING,
        aliases: ["seedbag"],
        cooldown: 3000
    });
};
