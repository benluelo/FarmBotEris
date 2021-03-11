"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { NPC } = require("./npc.js");
const get_names_1 = __importDefault(require("./get-names"));
const transliteration_1 = require("transliteration");
const crop_data_1 = __importDefault(require("./crop-data"));
/**
 * Creates 12 random farmers for the given region. If the region name is invalid, returns `undefined`.
 */
module.exports.run = (region) => {
    const nameSurnameAndGenderArray = get_names_1.default(region);
    if (nameSurnameAndGenderArray === undefined) {
        return undefined;
    }
    // why do i filter out apples? i don't remembe
    // there are to be 11 villagers, maybe thats why i remove it?
    // shoulda documented this better lol
    const fruitsArray = Object.keys(crop_data_1.default)
        .filter((name) => "apple" !== name);
    return [...new Array(11)]
        .map(() => Math.random())
        .sort()
        .map((num, i) => new NPC(transliteration_1.transliterate(nameSurnameAndGenderArray[i].name + " " + nameSurnameAndGenderArray[i].surname), nameSurnameAndGenderArray[i].gender, fruitsArray[i], num));
};
