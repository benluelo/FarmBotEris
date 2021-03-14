import { User as ErisUser } from "eris";
import CONSTANTS from "./CONSTANTS";
import config from "../config";
import regions from "./names.json";
import flags from "./flags.json";
import { NPC } from "./npc";
import { UserData } from "../dtos/UserData";
import { CropName } from "../dtos/Crop";
import { Farmer } from "../dtos/Farmer";
import { MarketRequest } from "../dtos/MarketRequest";
import { Seed } from "../dtos/Seed";
import { Plot } from "../dtos/Plot";

import { v4 as uuid } from "uuid"

export default class User implements UserData {
    userID;
    region: {
        name: keyof typeof regions;
        flag: typeof flags[keyof typeof regions];
    };
    messagesUserSent: number;
    botCommandsUsed: number;
    money: number;
    farm: Plot[];
    seeds: {
        common: Record<CropName, Seed>;
    };
    requests: Record<string, MarketRequest>;
    farmers: Farmer[];
    permissions: (typeof CONSTANTS.PERMISSIONS)[keyof typeof CONSTANTS.PERMISSIONS];
    requestTimeOut: number;
    requestAmount: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    uuid: string;
    updated = true;

    /**
     * @description Creates a new user for the database.
     * @param author - The author of the message.
     * @param region - The region that the user is farming in.
     * @param farmers - The farmers of the user (i.e. their "village").
     */
    constructor(author: ErisUser | string, region: string, farmers: Farmer[]) {
        this.userID = typeof author === "string" ? author : author.id;
        this.region = {
            name: region as keyof typeof regions,
            flag: flags[region as keyof typeof regions]
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
        this.permissions = config.ownersIDs.includes(this.userID) ? CONSTANTS.PERMISSIONS.DEVELOPMENT : CONSTANTS.PERMISSIONS.EVERYONE;
        this.requestTimeOut = 0;
        this.requestAmount = 9;
        this.uuid = uuid();
        this.updated = true;
    }
    
    newRequest(returnRequest = false) {
        const randomFarmer = this.farmers[Math.floor(Math.random() * this.farmers.length)];
        const randomReq = new NPC(randomFarmer.name, randomFarmer.gender, randomFarmer.unlockableCrop, randomFarmer.wealth, randomFarmer.preferences)
            .newRequest(this.seeds.common);
        if (returnRequest) {
            return randomReq;
        }
        this.requests[randomReq.id] = randomReq.req;
    }

    /**
     * @description Creates a `User` class from a `UserData` object (typically from the database, but who knows?)
     * @param author The author of the message.
     * @param userdata The userdata object from the database.
     */
    static fromUserData(userdata: UserData, author: ErisUser | string): User {
        const user = new User(author, userdata.region.name, userdata.farmers)
        return { ...user, ...userdata, newRequest: user.newRequest }
    }
}
