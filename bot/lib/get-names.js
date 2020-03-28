const names = require("./names.json")
const genders = ["male", "female"]

module.exports = (region) => {
  region = region[0].toUpperCase() + region.substr(1).toLowerCase()
  const toReturn = []
  for (let i = 0; i < 12; i++) {
    const randomGender = genders[Math.floor(Math.random() * genders.length)]
    toReturn.push({
      name: names[region][randomGender][Math.floor(Math.random() * names[region][randomGender].length)],
      surname: names[region].surnames[Math.floor(Math.random() * names[region].surnames.length)],
      gender: randomGender
    })
  }
  return toReturn
}