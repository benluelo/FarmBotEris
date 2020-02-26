/**
 * @param {import("eris").Message} message - the message that was sent to the command.
 */
module.exports = (message) => {
  message.send(`You have to start farming first, **${message.author.username}**! Send \`farm start\` to start farming!`)
}