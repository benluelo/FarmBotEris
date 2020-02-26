const MAX_PLOTS = 25
const { Embed } = require("../../lib/classes")
const emoji = require("../../lib/emoji.json")
// a Math.round(Math.pow(1.90546071796, i))

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = async (bot) => {

  bot.registerCommand("buy", (message) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (userdata.farm.length >= MAX_PLOTS) {
          return message.send(new bot.embed().uhoh(`${message.author.username}, you already have the maximum number of plots!`))
        }

        const numberOfCurrentPlots = userdata.farm.length
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots + 1))
        if (userdata.money < priceOfNextPlot) {
          const notEnoughEmbed = new Embed()
            .setTitle("Insufficient Funds!")
            .setDescription(`The next plot costs **${priceOfNextPlot}** ${emoji.coin}`)
            .setColor(bot.color.error)

          return message.send(notEnoughEmbed)
        }

        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {
          $push: {
            farm: {
              crop: {
                planted: "dirt",
                datePlantedAt: Date.now()
              },
              fertilized: false,
              watered: false
            }
          },
          $inc: {
            money: -priceOfNextPlot
          }
        }).then((res) => {
          const plotGotEmbed = new bot.embed()
            .setDescription(`Plot purchased for **${bot.formatMoney(priceOfNextPlot)}**! You now own ${res.value.farm.length + 1} plots!${res.value.farm.length + 1 === MAX_PLOTS ? " This is the maximum amount of plots!" : ""}`)
            .setColor(bot.color.success)
          return message.send(plotGotEmbed)
        })
      } else {
        bot.startMessage(message)
      }
    })
  }, bot.cooldown(5000))
}