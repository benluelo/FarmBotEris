/* eslint-disable linebreak-style */

/**
 * @typedef {Object} CropData
 * @prop {CropEmoji} crop.emoji
 * @prop {import("../lib/farmer-data.js").colors} crop.color
 * @prop {import("../lib/farmer-data.js").tastes[]} crop.flavour
 */

/**
 * @typedef {("🍎" | "🍊" | "🍋" | "🍐" | "🍒" | "🍑" | "🥭" | "🍈" | "🍇" | "🍓" | "🍌" | "🍍")} CropEmoji
 */

/**
 * @typedef {("apple" | "orange" | "lemon" | "pear" | "cherry" | "peach" | "mango" | "melon" | "grapes" | "strawberry" | "banana" | "pineapple")} CropName
 */

/**
 * @type {Object<string, CropData>}
 */
module.exports = {
  "apple": {
    "emoji": "🍎",
    "flavour": [
      "sweet",
      "sweet"
    ],
    "color": "red"
  },
  "orange": {
    "emoji": "🍊",
    "flavour": [
      "sweet",
      "tart"
    ],
    "color": "orange"
  },
  "lemon": {
    "emoji": "🍋",
    "flavour": [
      "sweet",
      "sour"
    ],
    "color": "yellow"
  },
  "pear": {
    "emoji": "🍐",
    "flavour": [
      "sweet",
      "sweet"
    ],
    "color": "green"
  },
  "cherry": {
    "emoji": "🍒",
    "flavour": [
      "sweet",
      "sour"
    ],
    "color": "red"
  },
  "peach": {
    "emoji": "🍑",
    "flavour": [
      "sweet",
      "sweet"
    ],
    "color": "pink"
  },
  "mango": {
    "emoji": "🥭",
    "flavour": [
      "sour",
      "sweet"
    ],
    "color": "pink"
  },
  "melon": {
    "emoji": "🍈",
    "flavour": [
      "sweet",
      "sweet"
    ],
    "color": "green"
  },
  "grapes": {
    "emoji": "🍇",
    "flavour": [
      "sweet",
      "tart"
    ],
    "color": "purple"
  },
  "strawberry": {
    "emoji": "🍓",
    "flavour": [
      "sweet",
      "tart"
    ],
    "color": "red"
  },
  "banana": {
    "emoji": "🍌",
    "flavour": [
      "sweet",
      "sweet"
    ],
    "color": "yellow"
  },
  "pineapple": {
    "emoji": "🍍",
    "flavour": [
      "sweet",
      "tart"
    ],
    "color": "yellow"
  }
}