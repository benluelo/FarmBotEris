module.exports = {
  emoji: {
    male: [
      "👨🏻‍🌾",
      "👨🏼‍🌾",
      "👨🏽‍🌾",
      "👨🏾‍🌾",
      "👨🏿‍🌾"
    ],
    female: [
      "👩🏻‍🌾",
      "👩🏼‍🌾",
      "👩🏽‍🌾",
      "👩🏾‍🌾",
      "👩🏿‍🌾"
    ]
  },
  /**
   * @description Farmer preferences.
   * @namespace
   */
  preferences: {
    /**
     * @type {colors[]}
     */
    color: [
      "red",
      "orange",
      "yellow",
      "green",
      "pink",
      "purple"
    ],
    /**
     * @type {tastes[]}
     */
    taste: [
      "sweet",
      "sour",
      "tart"
    ]
  }
}

/**
 * @typedef {("red" | "orange" | "yellow" | "green" | "pink" | "purple")} colors
 */

/**
 * @typedef {("sweet" | "sour" | "tart")} tastes
 */