const { inspect } = require("util")
exports.run = (bot) => {
  bot.registerCommand("eval", (message, args) => {
    const toEval = args.join(" ")
    try {
      const evaluated = inspect(eval(toEval, { depth: 0 }))
      if (toEval) {
        const hrStart = process.hrtime()
        const hrDiff = process.hrtime(hrStart)
        const evalEmbed = {
          embed: {
            title: "Evaluation",
            color: bot.color.lightgreen,
            fields: [
              {
                name: ":scroll: Script",
                value: `\`\`\`javascript\n${toEval}\n\`\`\``
              },
              {
                name: ":white_check_mark: Result",
                value: `\`\`\`javascript\n${evaluated}\n\`\`\``
              },
              {
                name: ":alarm_clock: Evaluation Time",
                value: `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ""}${hrDiff[1] / 1000000}ms.`
              }
            ]
          }
        }
        bot.createMessage(message.channel.id, evalEmbed)
      } else {
        bot.createMessage(message.channel.id, "Error while evaluating: `cannot evaluate nothing`")  // its a hard word ik FCKN LISTEN OK ITS 4AM 4AM!!!!!LOL     - leave that there for production lmao - agreed
      }
    } catch (e) {
      bot.createMessage(message.channel.id, `Error while evaluating: \`${e.message}\``)
    }
  }, {
    requirements: {
      userIDs: bot.ownersIDS
    }
  })
}