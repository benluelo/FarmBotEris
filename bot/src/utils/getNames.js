import names from "../json/names.json";
import { genders, randomIndex } from "./utils";
export function getNames(region) {
    if (names.hasOwnProperty(region)) {
        let regionCleaned = region;
        return [...new Array(12)].map(() => {
            const randomGender = genders[randomIndex(genders)];
            return {
                name: names[regionCleaned][randomGender][randomIndex(names[regionCleaned][randomGender])],
                surname: names[regionCleaned].surnames[randomIndex(names[regionCleaned].surnames)],
                gender: randomGender
            };
        });
    }
}
