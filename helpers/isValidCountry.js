import flags from "../bot/lib/flags.json";
export function isValidCountry(country) {
    // shh its ok
    // @ts-ignore
    return flags[country] !== undefined;
}
