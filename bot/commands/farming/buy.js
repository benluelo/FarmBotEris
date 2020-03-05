const MAX_PLOTS = 25
// a Math.round(Math.pow(1.90546071796, i))

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = async (bot) => {

  bot.addCommand("buy", (message) => {

    console.log(bot.Cooldowns.check(message.author.id, "buy"))

    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (userdata.farm.length >= MAX_PLOTS) {
          return message.send(new bot.Embed().uhoh(`${message.author.username}, you already have the maximum number of plots!`))
        }

        const numberOfCurrentPlots = userdata.farm.length
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots + 1))
        const priceOfNextPlotEmbed = new bot.Embed()
          .setTitle("")
          .setDescription(`The next plot costs **${bot.formatMoney(priceOfNextPlot)}!**`)
          .setColor(bot.color.lightgreen)

        return message.send(priceOfNextPlotEmbed)
      } else {
        bot.startMessage(message)
      }
    })
  // eslint-disable-next-line no-unused-vars
  }).subcommand("confirm", (message, args) => {

    bot.getUser(message.author.id, async (err, userdata) => {
      if (err) { bot.log.error(err) }

      if (userdata) {
        if (userdata.farm.length >= MAX_PLOTS) {
          return message.send(new bot.Embed().uhoh(`${message.author.username}, you already have the maximum number of plots!`))
        }

        const numberOfCurrentPlots = userdata.farm.length
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots + 1))
        if (userdata.money < priceOfNextPlot) {
          const notEnoughEmbed = new bot.Embed()
            .setTitle("Insufficient Funds!")
            .setDescription(`The next plot costs **${bot.formatMoney(priceOfNextPlot)}.**`)
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
          const plotGotEmbed = new bot.Embed()
            .setDescription(`Plot purchased for **${bot.formatMoney(priceOfNextPlot)}**! You now own ${res.value.farm.length + 1} plots!${res.value.farm.length + 1 === MAX_PLOTS ? " This is the maximum amount of plots!" : ""}`)
            .setColor(bot.color.success)
          return message.send(plotGotEmbed)
        })
      } else {
        bot.startMessage(message)
      }
    })

  })
}