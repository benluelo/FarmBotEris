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
                planted: bot.config.farminfo.dirt,
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
                crop: "🍎",
                discovered: true,
                amount: 0
              },
              tangerine: {
                crop: "🍊",
                discovered: true,
                amount: 0
              },
              lemon: {
                crop: "🍋",
                discovered: true,
                amount: 0
              },
              pear: {
                crop: "🍐",
                discovered: true,
                amount: 0
              },
              cherry: {
                crop: "🍒",
                discovered: true,
                amount: 0
              },
              peach: {
                crop: "🍑",
                discovered: true,
                amount: 0
              },
              mango: {
                crop: "🥭",
                discovered: true,
                amount: 0
              },
              melon: {
                crop: "🍈",
                discovered: true,
                amount: 0
              },
              grape: {
                crop: "🍇",
                discovered: true,
                amount: 0
              },
              strawberry: {
                crop: "🍓",
                discovered: true,
                amount: 0
              },
              banana: {
                crop: "🍌",
                discovered: true,
                amount: 0
              },
              pineapple: {
                crop: "🍍",
                discovered: true,
                amount: 0
              }
            }
            // uncommon:{
            //     rose: {
            //         discovered: true,
            //         amount: 0
            //     }

            // },
            // rare: {
            //     corn: {
            //         discovered: true,
            //         amount: 0
            //     }
            // },
            // epic: {
            //     tulip: {
            //         discovered: true,
            //         amount: 0
            //     }
            // },
            // legendary: {
            //     broccoli: {
            //         discovered: true,
            //         amount: 0
            //     }
            // },
            // mythical:{
            //     carrot: {
            //         discovered: true,
            //         amount: 0
            //     }
            // },
            // seasonal:{
            //     christmas_tree: {
            //         discovered: true,
            //         amount: 0
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
  }, {
    cooldown: 60000,
    cooldownMessage: function() {
      return "cooldown is 60 seconds pls slow down"
    },
    cooldownExclusions: {
      channelIDs: [
        "669353094953435183" // dev stuff > #test-test
      ]
    }
  })
}