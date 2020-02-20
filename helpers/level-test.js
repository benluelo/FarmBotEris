// const { question } = require("readline-sync")
const getLevel = (base, exp, level=1) => {
  // console.log("base", base, "exp", exp, "level", level)
  const tempSum = Math.floor(((1 - Math.pow(base, level)) / (1 - base)))
  // console.log("tempSum:", tempSum)
  const previous = Math.floor((1 - Math.pow(base, level-1)) / (1 - base))
  // console.log("previous:", previous)
  // console.log()
  if (tempSum < exp){
    return getLevel(base, exp, level+1)
  } else {
    // console.log("d:", (1 - Math.pow(base, level-1)) / (1 - base))
    return {
      level: level - 1,
      numerator: exp - previous,
      denominator: Math.floor((tempSum) - ((1 - Math.pow(base, level-1)) / (1 - base)))
    }
  }
}

module.exports = {
  getLevel
}

// console.log(getLevel(parseFloat(question("base? ")), parseFloat(question("experience? "))))