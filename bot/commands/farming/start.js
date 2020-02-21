const { Embed } = require("../../lib/classes")
const EmbedPaginator = require("eris-pagination")
const flags = require("../../lib/flags.json")

exports.run = bot => {
  bot.registerCommand("start", (message, args) => {
    bot.database.Userdata.findOne({ userID: message.author.id}, async (err, userdata) => {
      if (err) bot.log.error(err)
      if (!userdata) {

        if (!args[0]){

          let myEmbeds = []

          let count = 0
          let embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
          for (const flag in flags){
            count++
            embed.addField(flag, flags[flag], true)

            if (count === 12){
              count = 0
              myEmbeds.push(embed.showContent())
              embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
            }
          }
          if (count !== 0){
            myEmbeds.push(embed.showContent())
          }

          return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
        } else {
          const region = args.join(" ").toLowerCase()
          if (!flags[region]) { return bot.createMessage(message.channel.id, `${region} is not a valid region!`) }
          const farmers = await require("../../lib/get-farmers.js").run(region)
          console.log(farmers)
          bot.database.Userdata.insertOne({
            userID: message.author.id,
            userTag: message.author.username + "#" + message.author.discriminator,
            nickname: message.author.username,
            region: {
              name: region,
              flag: flags[region]
            },
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
                  level: 0,
                  amount: 0
                },
                orange: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                lemon: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                pear: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                cherry: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                peach: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                mango: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                melon: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                grapes: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                strawberry: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                banana: {
                  discovered: false,
                  level: 0,
                  amount: 0
                },
                pineapple: {
                  discovered: false,
                  level: 0,
                  amount: 0
                }
              }
              // uncommon:{
              //     rose: {
              //         discovered: false,
              //
              //     }

              // },
              // rare: {
              //     corn: {
              //         discovered: false,
              //
              //     }
              // },
              // epic: {
              //     tulip: {
              //         discovered: false,
              //
              //     }
              // },
              // legendary: {
              //     broccoli: {
              //         discovered: false,
              //
              //     }
              // },
              // mythical:{
              //     carrot: {
              //         discovered: false,
              //
              //     }
              // },
              // seasonal:{
              //     christmas_tree: {
              //         discovered: false,
              //
              //     }
              // }
            },
            requests: [],
            farmers: farmers
          })
          bot.createMessage(message.channel.id, new Embed()
            .setTitle(`Welcome to ${bot.user.username}, ${message.author.username}! ${flags[region]}`)
            .setDescription("Do `f!help` to display the full list of commands the bot has!")
            .setColor(bot.color.lightgreen)
          )
        }
      }
      if (userdata) {
        bot.createMessage(message.channel.id, `You've already started farming, ${message.author.username}!`)
      }
    })
  }, bot.cooldown(60000))
}