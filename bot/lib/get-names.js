"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const names_json_1 = __importDefault(require("./names.json"));
const genders = ["male", "female"];
exports.default = (region) => {
    const capitalized = capitalize(region);
    if (names_json_1.default.hasOwnProperty(capitalized)) {
        let regionCleaned = capitalized;
        return [...new Array(12)].map(() => {
            const randomGender = genders[randomIndex(genders)];
            return {
                name: names_json_1.default[regionCleaned][randomGender][randomIndex(names_json_1.default[regionCleaned][randomGender])],
                surname: names_json_1.default[regionCleaned].surnames[randomIndex(names_json_1.default[regionCleaned].surnames)],
                gender: randomGender
            };
        });
    }
};
function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
