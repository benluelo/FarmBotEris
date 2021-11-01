import flags from '../json/flags.json';

export function isValidCountry(country: string): country is keyof typeof flags {
  // shh its ok
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.keys(flags).map(value => value.toLocaleLowerCase()).includes(country);
}
