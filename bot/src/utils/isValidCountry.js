import flags from "../json/flags.json";
export function isValidCountry(country) {
    // shh its ok
    // @ts-ignore
    return flags[country] !== undefined;
}
