const { inspect } = require("util")
/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = (bot) => {
  bot.addCommand("eval", (message, args) => {
    if (!bot.ownersIDs.includes(message.author.id)) { return }
    const toEval = args.join(" ")
    try {
      const evaluated = inspect(eval(toEval, { depth: 0 }))
      if (toEval) {
        const hrStart = process.hrtime()
        const hrDiff = process.hrtime(hrStart)
        const evalEmbed = new bot.Embed()
          .setTitle("Evaluation")
          .setColor(bot.color.lightgreen)
          .addField(":scroll: Script", `\`\`\`javascript\n${toEval}\n\`\`\``)
          .addField(":white_check_mark: Result", `\`\`\`javascript\n${evaluated}\n\`\`\``)
          .addField(":alarm_clock: Evaluation Time", `${0 < hrDiff[0] ? `${hrDiff[0]}s` : ""}${hrDiff[1] / 1000000}ms.`)

        message.send(evalEmbed)
      } else {
        message.send("Error while evaluating: `cannot evaluate nothing`")  // its a hard word ik FCKN LISTEN OK ITS 4AM 4AM!!!!!LOL     - leave that there for production lmao - agreed
      }
    } catch (e) {
      message.send(`Error while evaluating: \`${e.message}\``)
    }
  })
}