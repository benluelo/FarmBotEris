import CONSTANTS from "../lib/CONSTANTS"
export const uuid = require("uuid").v4

export interface UserData {
    /** The ID of the user. */
    userID: string
    /** The username and discriminator of the user. */
    userTag: string
    nickname: string
    /** The region that the user is in. */
    region: {
        /** The name of the region. */
        name: string;
        /** The flag of the region. */
        flag: string;
    }
    messagesUserSent: number
    botCommandsUsed: number
    /** The amount of money the user has. */
    money: number
    /** The user's farm. */
    farm: Plot[]
    /** The user's seeds. */
    // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍌🍍
    seeds: { [s: string]: { [s in CropName]: Seed } }
    /** The user's current requests. */
    requests: { [s: string]: MarketRequest }
    /** The farmers in the user's village. */
    farmers: Farmer[]
    /** The farmers in the user's village. */
    permissions: typeof CONSTANTS.PERMISSIONS[keyof typeof CONSTANTS.PERMISSIONS]
    /** When the user's last market refresh was. */
    requestTimeOut: number
    /** How many new requests the user has left for the hour. */
    requestAmount: number
}

export type CropEmoji = "🍎" | "🍊" | "🍋" | "🍐" | "🍒" | "🍑" | "🥭" | "🍈" | "🍇" | "🍓" | "🍌" | "🍍"
export type CropName = "apple" | "orange" | "lemon" | "pear" | "cherry" | "peach" | "mango" | "melon" | "grapes" | "strawberry" | "banana" | "pineapple"
export type CropColors = "red" | "orange" | "yellow" | "green" | "pink" | "purple"
export type CropFlavours = "sweet" | "sour" | "tart"
export type CropInformation = {
    /** The emoji of the crop. */
    emoji: CropEmoji;
    /** The color of the crop. */
    color: CropColors;
    /** The flavors of the crop. */
    flavour: CropFlavours[];
}

// {\n *emoji: ".*",\n *flavour: \[\n *".*",\n *".*"\n *\],\n *color: ".*"\n *}
export type CropInformationMap = {
    [K in CropName]: CropInformation
}

export type Plot = {
    crop: {
        /** The crop currently planted on the plot. */
        planted: CropName | "dirt"
        /** The time that the crop was planted at. */
        datePlantedAt: number
    }
    /** Whether or not the plot is fertilized. **Not yet implemented**! */
    fertilized: boolean
    /** Whether or not the plot is watered. **Not yet implemented**! */
    watered: boolean
}

export type Seed = {
    /** Whether or not the crop has been discovered. */
    discovered: boolean;
    /** The level of the seed (i.e. it's experience level). */
    level: number;
    /** The amount of the seed that the user has in their inventory. */
    amount: number
}
// /\*\*\n\s*\*\s@typedef \{[a-zA-Z]*\} [a-zA-Z]*\n

export type MarketRequest = {
    /** The name of the farmer who's request this is. */
    name: string;
    /** What the farmer wants. */
    want: {
        /** The crop they want. */
        crop: CropName;
        /** The amount of the crop they want. */
        amount: number;
    }[]
    /** How much they are willing to pay. */
    value: number;
    /** How much reputation filling the request gives. */
    reputation: number;
}

export type Farmer = {
    /** The name of the Farmer. */
    name: string
    /** The gender of the Farmer. */
    gender: "male" | "female"
    /** The crop that this user will unlock when they hit their unlock level. */
    unlockableCrop: CropName
    /** The wealth of the Farmer. */
    wealth: number
    /** The preferences of the Farmer. */
    preferences: { color: CropColors, taste: CropFlavours[] }
    /** The level of the Farmer (i.e. their experience points). */
    level: number
    /** The level that the farmer will unlock their crop at  (between `5` and `10`). */
    unlockLevel: number
    /** The emoji of the Farmer. */
    emoji: string
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