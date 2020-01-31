/**
 * Channel ID; a string containing only numbers.
 * @typedef {String} ChannelID
 */

/**
 * The cooldown object for the Eris `CommandClient.registerCommand()` method.
 * @typedef {Object} CooldownObject
 * @property {Number} cooldown - the length of the cooldown.
 * @property {function():String} cooldownMessage - the message to send when the command is used when the cooldown is still active.
 * @property {Object} cooldownExclusions - any exclusions to the cooldown.
 * @property {ChannelID[]} cooldownExclusions.channelIDs - {@link ChannelID} exclusions to the cooldown.
 */

/**
 * Returns a cooldown object for the Eris `CommandClient.registerCommand()` method.
 * @param {Number} length - the length of the cooldown to set, in milliseconds.
 * @returns {CooldownObject} {@link CooldownObject}
 */
const cooldown = (length) => {
  return {
    cooldown: length,
    cooldownMessage: () => {
      return `cooldown is ${length/1000} seconds pls slow down`
    },
    cooldownExclusions: {
      channelIDs: [
        "669353094953435183" // dev stuff > #test-test
      ]
    }
  }
}

module.exports = cooldown