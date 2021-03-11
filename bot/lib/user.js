"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CONSTANTS_1 = __importDefault(require("./CONSTANTS"));
const { ownersIDs } = require("../config.js");
const uuid = require("uuid").v4;
const flags_json_1 = __importDefault(require("../lib/flags.json"));
const npc_1 = require("./npc");
class User {
    /**
     * @description Creates a new user for the database.
     * @param author - The author of the message.
     * @param region - The region that the user is farming in.
     * @param farmers - The farmers of the user (i.e. their "village").
     */
    constructor(author, region, farmers) {
        this.updated = true;
        this.userID = author.id;
        this.userTag = author.username + "#" + author.discriminator;
        this.nickname = author.username;
        this.region = {
            name: region,
            flag: flags_json_1.default[region]
        };
        this.messagesUserSent = 0;
        this.botCommandsUsed = 0;
        this.money = 0;
        this.farm = [
            {
                crop: {
                    planted: "dirt",
                    datePlantedAt: Date.now()
                },
                fertilized: false,
                watered: false
            }
        ];
        this.seeds = {
            common: {
                apple: {
                    discovered: true,
                    level: 0,
                    amount: 0
                },
                orange: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                lemon: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                pear: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                cherry: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                peach: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                mango: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                melon: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                grapes: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                strawberry: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                banana: {
                    discovered: false,
                    level: 0,
                    amount: 0
                },
                pineapple: {
                    discovered: false,
                    level: 0,
                    amount: 0
                }
            }
        };
        this.requests = {};
        this.farmers = farmers;
        this.permissions = ownersIDs.includes(author.id) ? CONSTANTS_1.default.PERMISSIONS.DEVELOPMENT : CONSTANTS_1.default.PERMISSIONS.EVERYONE;
        this.requestTimeOut = 0;
        this.requestAmount = 9;
        this.uuid = uuid();
        this.updated = true;
    }
    newRequest(returnRequest = false) {
        const randomFarmer = this.farmers[Math.floor(Math.random() * this.farmers.length)];
        const randomReq = new npc_1.NPC(randomFarmer.name, randomFarmer.gender, randomFarmer.unlockableCrop, randomFarmer.wealth, randomFarmer.preferences)
            .newRequest(this.seeds.common);
        if (returnRequest) {
            return randomReq;
        }
        this.requests[randomReq.id] = randomReq.req;
    }
}
class UserData extends User {
    /**
     * @description Essentially the same as `User`, except it allows for the creation of a `User` object with an existing userdata.
     * @todo Merge `User` and `UserData`.
     * @param {import("eris").User} author - The author of the message.
     * @param {User} userdata - The userdata object from the database.
     */
    constructor(author, userdata) {
        super(author, userdata.region.name, userdata.farmers);
        this.seeds = userdata.seeds;
        this.botCommandsUsed = userdata.botCommandsUsed;
        this.farm = userdata.farm;
        this.messagesUserSent = userdata.messagesUserSent;
        this.money = userdata.money;
        this.nickname = userdata.nickname;
        this.permissions = userdata.permissions;
        this.requestAmount = userdata.requestAmount;
        this.requestTimeOut = userdata.requestTimeOut;
        this.seeds = userdata.seeds;
        this.updated = true;
    }
}
// uncommon:{
//     rose: {
//         discovered: false,
//
//     }
// },
// rare: {
//     corn: {
//         discovered: false,
//
//     }
// },
// epic: {
//     tulip: {
//         discovered: false,
//
//     }
// },
// legendary: {
//     broccoli: {
//         discovered: false,
//
//     }
// },
// mythical:{
//     carrot: {
//         discovered: false,
//
//     }
// },
// seasonal:{
//     christmas_tree: {
//         discovered: false,
//
//     }
// }
