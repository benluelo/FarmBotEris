const hour = 3600000

// ideas for the prices
// - random (low) chance for any seed price to be decreased by 50%
// - if too many of a seed is sold in a curtain amount of time is decreases

let seedsPrice = {
  apple: 1,
  orange: 1,
  lemon: 1,
  pear: 1,
  cherry: 1,
  peach: 1,
  mango: 1,
  melon: 1,
  grapes: 1,
  strawberry: 1,
  banana: 1,
  pineapple: 1
}

const getRandomNumber = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min)).toFixed(2)
}

const randomPrice = () => {
  let min = 0.7
  let max = 1.5
  for (let seed in seedsPrice) {
    seedsPrice[seed] = getRandomNumber(min, max)
    min = min*1.15
    max = max*1.15
  }
}

randomPrice()
setInterval(() => {
  randomPrice()
}, hour)

module.exports = seedsPrice