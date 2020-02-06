const { Embed } = require("../lib/classes")
exports.run = bot => {
  bot.registerCommand("start", (message) => {
    bot.database.Userdata.findOne({ userID: message.author.id}, (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {
        bot.database.Userdata.insertOne({
          userID: message.author.id,
          userTag: message.author.username + "#" + message.author.discriminator,
          nickname: message.author.username,
          messagesUserSent: 0,
          botCommandsUsed: 0,
          money: 0,
          farm: [
            {
              crop: {
                planted: "dirt",
                datePlantedAt: Date.now()
              },
              fertilized: false,
              watered: false
            }
          ],
          seeds: {
            // 🍎🍊🍋🍐🍒🍑🥭🍈🍇🍓🍉🍌🍍
            common: {
              apple: {
                discovered: true,
                level: 1,
                amount: 0
              },
              orange: {
                discovered: true,
                level: 1,
                amount: 0
              },
              lemon: {
                discovered: true,
                level: 1,
                amount: 0
              },
              pear: {
                discovered: true,
                level: 1,
                amount: 0
              },
              cherry: {
                discovered: true,
                level: 1,
                amount: 0
              },
              peach: {
                discovered: true,
                level: 1,
                amount: 0
              },
              mango: {
                discovered: true,
                level: 1,
                amount: 0
              },
              melon: {
                discovered: true,
                level: 1,
                amount: 0
              },
              grapes: {
                discovered: true,
                level: 1,
                amount: 0
              },
              strawberry: {
                discovered: true,
                level: 1,
                amount: 0
              },
              banana: {
                discovered: true,
                level: 1,
                amount: 0
              },
              pineapple: {
                discovered: true,
                level: 1,
                amount: 0
              }
            }
            // uncommon:{
            //     rose: {
            //         discovered: true,
            //
            //     }

            // },
            // rare: {
            //     corn: {
            //         discovered: true,
            //
            //     }
            // },
            // epic: {
            //     tulip: {
            //         discovered: true,
            //
            //     }
            // },
            // legendary: {
            //     broccoli: {
            //         discovered: true,
            //
            //     }
            // },
            // mythical:{
            //     carrot: {
            //         discovered: true,
            //
            //     }
            // },
            // seasonal:{
            //     christmas_tree: {
            //         discovered: true,
            //
            //     }
            // }
          }
        })
        bot.createMessage(message.channel.id, new Embed()
          .setTitle(`Welcome to ${bot.user.username}`)
          .setDescription("Do `f!help` to display the full list of commands the bot has!")
          .setColor(bot.color.lightgreen).show()
        )
      }
      if (userdata) {
        bot.createMessage(message.channel.id, `You've already started farming, ${message.author.username}!`)
      }
    })
  }, bot.cooldown(60000))
}