/**
 * Gets the level and current experience progress of an NPC or Crop.
 * @param {Number} base - The base for the level calculation. Must be `>= 2`.
 * @param {Number} exp - The amount of experience for the level calculations. Must be `>= 0`.
 * @param {Number} level - Used for finding the level recursively. *Do not supply this parameters unless you know what you are doing!*
 * @returns {{level: Number, numerator: Number, denominator: Number}}
 */
const getLevel = (base, exp, level = 1) => {
  const tempSum = Math.floor(((1 - Math.pow(base, level)) / (1 - base)))
  const previous = Math.floor((1 - Math.pow(base, level - 1)) / (1 - base))
  if (tempSum <= exp) {
    return getLevel(base, exp, level + 1)
  } else {
    return {
      level: level - 1,
      numerator: exp - previous,
      denominator: Math.floor((tempSum) - ((1 - Math.pow(base, level - 1)) / (1 - base)))
    }
  }
}

module.exports = {
  getLevel
}

console.log(getLevel(2, 1))