import names from '../json/names.json';
import { genders, randomIndex } from './utils';

type GetNamesResult = {
  name: string;
  surname: string;
  gender: 'male' | 'female';
};


export function getNames(region: string): GetNamesResult[] | undefined {
  if (Object.prototype.hasOwnProperty.call(names, region)) {
    const regionCleaned = region as keyof typeof names;
    return [...new Array(12)].map(() => {
      const randomGender = genders[randomIndex(genders as unknown as string[])];
      return {
        name: names[regionCleaned][randomGender][randomIndex(names[regionCleaned][randomGender])],
        surname: names[regionCleaned].surnames[randomIndex(names[regionCleaned].surnames)],
        gender: randomGender
      };
    });
  }
}
