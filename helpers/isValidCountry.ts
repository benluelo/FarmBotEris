import flags from "../bot/lib/flags.json";

export function isValidCountry(country: string): country is keyof typeof flags {
  // shh its ok
  // @ts-ignore
  return flags[country] !== undefined;
}
