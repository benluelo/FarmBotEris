type LevelInfo = {
  level: Number
  numerator: Number
  denominator: Number
}

/**
 * @description Gets the level and current experience progress of an NPC or Crop.
 * @param base - The base for the level calculation. Must be `>= 2`.
 * @param exp - The amount of experience for the level calculations. Must be `>= 0`.
 * @param level - Used for finding the level recursively. *Do not supply this paramater unless you know what you are doing!*
 * @returns The level, numerator and denominator.
 */
export default function getLevel(base: number, exp: number, level: number = 1): { level: number; numerator: number; denominator: number}  {
  const tempSum = 10 * Math.floor(((1 - Math.pow(base, level)) / (1 - base)))
  const previous = 10 * Math.floor((1 - Math.pow(base, level - 1)) / (1 - base))
  if (tempSum <= exp) {
    return getLevel(base, exp, level + 1)
  } else {
    return {
      level: level,
      numerator: exp - previous,
      denominator: Math.floor(tempSum - previous)
    }
  }
}