import cropData from "../../lib/crop-data.js";
import { Attachment } from "../../lib/Attachment.js";
import { Embed } from "../../lib/Embed.js";
import { XPProgressBar } from "../../lib/XPProgressBar.js";
import { isValidCropName } from "../../../helpers/isValidCropName.js";
import CONSTANTS from "../../lib/CONSTANTS.js";
export function run(bot) {
    bot.addCommand("skills", (message, [cropArg, ..._args], userdata) => {
        if (userdata === undefined) {
            throw new Error("command `farm sell` requires a user data.");
        }
        if (bot.database === undefined) {
            return message.send("Database not yet initialized. Please try again in a moment.");
        }
        if (cropArg === undefined) {
            return message.send(`It seems you don't know what a \`${cropArg}\` is... maybe you mispelled it?`);
        }
        if (!isValidCropName(cropArg)) {
            const skillsEmbed = new Embed()
                .setAuthor(message.author.username, undefined, message.author.avatarURL)
                .setColor(bot.color.lightgreen);
            for (const seed in userdata.seeds.common) {
                // TODO: log this
                if (!isValidCropName(seed)) {
                    continue;
                }
                if (!userdata.seeds.common[seed].discovered) {
                    continue;
                }
                const XPBar = new XPProgressBar(userdata.seeds.common[seed].level, 5);
                if (bot.ENV.DEBUG === "true") {
                    console.log(XPBar.show());
                }
                skillsEmbed.addField(cropData[seed].emoji, `Level: **${XPBar.level()}**` + "\n" + XPBar.show(), true);
            }
            return message.send(skillsEmbed);
        }
        else {
            if (cropData[cropArg] && userdata.seeds.common[cropArg].discovered) {
                const attachment = new Attachment(cropArg);
                const XPBar = new XPProgressBar(userdata.seeds.common[cropArg].level);
                const seedSkillEmbed = new Embed()
                    .setAuthor(message.author.username, undefined, message.author.avatarURL)
                    .setColor(bot.color.lightgreen)
                    .setTitle(`${cropArg[0].toUpperCase() + cropArg.substr(1)}`)
                    .setThumbnail(attachment.link())
                    .addField(`Level: **${XPBar.level()}**`, XPBar.show());
                return message.send(seedSkillEmbed, attachment.send());
            }
            else {
                return message.send(new Embed().uhoh(`**${cropArg}** isn't one of your crops!`));
            }
        }
    }, {
        description: "Shows the level of all your seeds",
        usage: "​farm skills [seed]",
        examples: "farm skills apple",
        permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
        category: CONSTANTS.CATEGORIES.FARMING,
        cooldown: 5000
    });
}
