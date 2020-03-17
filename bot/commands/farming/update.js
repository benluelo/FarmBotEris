const EmbedPaginator = require("eris-pagination")
const flags = require("../../lib/flags.json")
const { User, UserData } = require("../../lib/user.js")

// console.log(PERMISSIONS)

/** @private @param {import("../../lib/FarmBotClient")} bot */
exports.run = (bot) => {
  bot.addCommand("update", async (message, args, userdata) => {

    if (userdata.updated == true) {
      return message.send(new bot.Embed().uhoh(`You've already updated, **${message.author.username}!**`))
    }

    if (!args[0]) {

      const myEmbeds = []

      let count = 0
      let embed = new bot.Embed({ title: "Send `farm start <region>` to start farming!" })
      for (const flag in flags) {
        count++
        embed.addField(flag.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "), flags[flag], true)

        if (count === 12) {
          count = 0
          myEmbeds.push(embed.showContent())
          embed = new bot.Embed({ title: "Send `farm start <region>` to start farming!" })
        }
      }
      if (0 !== count) {
        myEmbeds.push(embed.showContent())
      }

      return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
    } else {
      const region = args.join(" ").toLowerCase()
      if (!flags[region]) { return message.send(new bot.Embed().uhoh(`Couldn't find **"${region}"** anywhere on a map... maybe try somewhere else?`)) }
      const farmers = await require("../../lib/get-farmers.js").run(region)
      const newUser = new UserData(message.author, userdata)
      newUser.updated = true
      newUser.region = {
        name: region,
        flag: flags[region]
      }
      newUser.farmers = farmers
      for (let i = 0; i < 9; ++i) {
        newUser.newRequest()
      }
      // console.log(newUser)
      const res = await bot.database.Userdata.findOneAndDelete({ userID: userdata.userID })
      console.log(res)
      await bot.database.Userdata.insertOne(newUser)
      message.send(new bot.Embed()
        .setTitle(`Welcome back to ${bot.user.username}, ${message.author.username}!  ${flags[region]}`)
        .setDescription("See `farm village` to look at your new village!")
        .setColor(bot.color.lightgreen)
      )
    }
  }, {
    permissionLevel: bot.PERMISSIONS.EVERYONE,
    category: bot.CATEGORIES.FARMING,
    requiresUser: true
  })
}