const MAX_PLOTS = 25

exports.run = async (bot) => {

  // eslint-disable-next-line no-unused-vars
  bot.registerCommand("buy", (message, args) => {
      
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {
        bot.createMessage(
          message.channel.id,
          "You have to start farming first! Send `farm start` to start farming!"
        )
      }
      if (userdata) {
        if(userdata.farm.length >= MAX_PLOTS){
          bot.createMessage(
            message.channel.id,
            `${message.author.username}, you already have the maximum number of plots!`
          )
          return
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
  })
}