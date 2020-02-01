const MAX_PLOTS = 25
// Math.round(Math.pow(1.90546071796, i))
exports.run = async (bot) => {

  bot.registerCommand("buy", (message) => {

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {
        bot.startMessage(message)
        return
      }
      if (userdata) {
        if (userdata.farm.length >= MAX_PLOTS) {
          return bot.createMessage(
            message.channel.id,
            `${message.author.username}, you already have the maximum number of plots!`
          )
        }

        const numberOfCurrentPlots = userdata.farm.length
        const priceOfNextPlot = Math.round(Math.pow(1.90546071796, numberOfCurrentPlots+1))
        if (userdata.money < priceOfNextPlot) {
          const notEnoughEmbed = {
            embed: {
              title: "Insignificant Funds!",
              description: `The next plot costs **${priceOfNextPlot}** <:farmbot_coin:648032810682023956>`,
              color: bot.color.red
            }
          }
          return bot.createMessage(message.channel.id, notEnoughEmbed)
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
        }).then(res => {
          bot.createMessage(
            message.channel.id,
            `Plot purchased for **${bot.formatMoney(priceOfNextPlot)}**<:farmbot_coin:648032810682023956>! You now own ${res.value.farm.length + 1} plots!${res.value.farm.length + 1 === MAX_PLOTS ? " This is the maximum amount of plots!" : ""}`
          )
        })
      }
    })
  }, bot.cooldown(60000))
}