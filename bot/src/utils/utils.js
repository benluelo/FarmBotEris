export const plotRegex = /^[a-e]{1}[1-5]{1}$/;
export const genders = ["male", "female"];
export function randomIndex(array) {
    return Math.floor(Math.random() * array.length);
}
export function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
