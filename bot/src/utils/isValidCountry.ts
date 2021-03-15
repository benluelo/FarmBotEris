import flags from "../json/flags.json";

export function isValidCountry(country: string): country is keyof typeof flags {
  // shh its ok
  // @ts-ignore
  return flags[country] !== undefined;
}
