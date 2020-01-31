const MAX_PLOTS = 25

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
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id },
          { $push: {
            farm: {
              crop: {
                planted: "dirt",
                datePlantedAt: Date.now()
              },
              fertilized: false,
              watered: false
            }
          }
          }).then(res => {
          bot.createMessage(
            message.channel.id,
            `Plot purchased successfully! You now own ${res.value.farm.length + 1} plots!${res.value.farm.length + 1 === MAX_PLOTS ? " This is the maximum amount of plots!" : ""}`
          )
        })
      }
    })
  }, bot.cooldown(60000))
}