import names from "./names.json";
const genders = ["male", "female"];
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
function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
