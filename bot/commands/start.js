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
                level: 1
              },
              orange: {
                discovered: true,
                level: 1
              },
              lemon: {
                discovered: true,
                level: 1
              },
              pear: {
                discovered: true,
                level: 1
              },
              cherry: {
                discovered: true,
                level: 1
              },
              peach: {
                discovered: true,
                level: 1
              },
              mango: {
                discovered: true,
                level: 1
              },
              melon: {
                discovered: true,
                level: 1
              },
              grape: {
                discovered: true,
                level: 1
              },
              strawberry: {
                discovered: true,
                level: 1
              },
              banana: {
                discovered: true,
                level: 1
              },
              pineapple: {
                discovered: true,
                level: 1
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
        bot.createMessage(message.channel.id, { embed: {
          title: `Welcome to ${bot.user.username}`,
          description: "Do `f!help` to display the full list of commands the bot has!",
          color: bot.color.lightgreen
        }})
      }

      if (userdata) {
        bot.createMessage(message.channel.id, `You've already started farming, ${message.author.username}!`)
      }
    })
  }, bot.cooldown(60000))
}