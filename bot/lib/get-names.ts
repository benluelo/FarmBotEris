import names from "./names.json"
const genders = ["male", "female"] as const

export default (region: string) => {
  const capitalized = capitalize(region)
  if (names.hasOwnProperty(capitalized)) {
    let regionCleaned = capitalized as keyof typeof names
    return [...new Array(12)].map(() => {
      const randomGender = genders[randomIndex(genders as unknown as any[])]
      return {
        name: names[regionCleaned][randomGender][randomIndex(names[regionCleaned][randomGender])],
        surname: names[regionCleaned].surnames[randomIndex(names[regionCleaned].surnames)],
        gender: randomGender
      }
    })
  }
}

function randomIndex(array: any[]): number {
  return Math.floor(Math.random() * array.length)
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}