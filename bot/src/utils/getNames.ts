import names from "../json/names.json";
import { genders, randomIndex } from "./utils";


export function getNames(region: string) {
  if (names.hasOwnProperty(region)) {
    let regionCleaned = region as keyof typeof names;
    return [...new Array(12)].map(() => {
      const randomGender = genders[randomIndex(genders as unknown as any[])];
      return {
        name: names[regionCleaned][randomGender][randomIndex(names[regionCleaned][randomGender])],
        surname: names[regionCleaned].surnames[randomIndex(names[regionCleaned].surnames)],
        gender: randomGender
      };
    });
  }
}
