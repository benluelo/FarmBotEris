"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../lib/classes");
const CONSTANTS_1 = __importDefault(require("../../lib/CONSTANTS"));
module.exports.run = (bot) => {
    bot.addCommand("deleteuser", (message) => {
        if (!message.mentions[0]) {
            // delete your own account
            const deleteUserEmbed = new classes_1.Embed().uhoh(`**${message.author.username} (${message.author.id})**, account has been deleted`);
            bot.database?.Userdata.deleteOne({ userID: message.author.id });
            message.send(deleteUserEmbed);
        }
        else {
            // delete someones elses account
            const userToDelete = message.mentions[0];
            const deleteUserEmbed = new classes_1.Embed().uhoh(`**${userToDelete.username} (${userToDelete.id})**, account has been deleted`);
            bot.database?.Userdata.deleteOne({ userID: userToDelete.id });
            message.send(deleteUserEmbed);
        }
    }, {
        description: "Delete a user from the database.",
        usage: "farm deleteuser [@mention]",
        // examples: false,
        permissionLevel: CONSTANTS_1.default.PERMISSIONS.DEVELOPMENT,
        category: CONSTANTS_1.default.CATEGORIES.DEVELOPMENT,
        cooldown: 0
    });
};
