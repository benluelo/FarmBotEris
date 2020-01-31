const hour = 3600000

let seedsPrice = {
  apple: 1,
  orange: 1,
  lemon: 1,
  pear: 1,
  cherry: 1,
  peach: 1,
  mango: 1,
  melon: 1,
  grape: 1,
  strawberry: 1,
  banana: 1,
  pineapple: 1
}

const getRandomNumber = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

const randomPrice = () => {
  for (let seed in seedsPrice) {
    seedsPrice[seed] = getRandomNumber(0.7, 1.5)
  }
}

randomPrice()
setInterval(() => {
  randomPrice()
}, hour)

module.exports = seedsPrice