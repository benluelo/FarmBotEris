exports.run = (bot) => {
  bot.registerCommand("seeds", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      let seeds = ""
      for (let crop in userdata.seeds.common) {
        if (userdata.seeds.common[crop].discovered) {
          seeds += `:${crop}: ${crop.charAt(0).toUpperCase() + crop.slice(1)}\n`
        }
      }
      let seedsEmbed = {
        embed: {
          title: "Seeds",
          description: seeds,
          color: bot.color.darkgreen
        }
      }
      await bot.createMessage(message.channel.id, seedsEmbed)
    })
  })
}