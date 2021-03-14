import EmbedPaginator from "eris-pagination"
import { isValidCountry } from "../../../helpers/isValidCountry.js"
import CONSTANTS from "../../lib/CONSTANTS.js"
import { Embed } from "../../lib/Embed.js"
import { FarmBotClient } from "../../lib/FarmBotClient.js"
import flags from "../../lib/flags.json"
import User from "../../lib/User.js"
import getFarmers from "../../lib/get-farmers.js"

export default (bot: FarmBotClient) => {
  bot.addCommand("update", async (message, args, userdata) => {
    if (userdata === undefined) {
      throw new Error("command `farm start` requires a user data.")
    }
    if (bot.database === undefined) {
      return message.send("Database not yet initialized. Please try again in a moment.")
    }

    if (userdata.updated === true) {
      return message.send(new Embed().uhoh(`You've already updated, **${message.author.username}!**`))
    }

    if (!args[0]) {

      const myEmbeds = []

      let count = 0
      let embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
      for (const [flagRegion, flag] of Object.entries(flags)) {
        count++
        embed.addField(flagRegion.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "), flag, true)

        if (count === 12) {
          count = 0
          myEmbeds.push(embed.showContent())
          embed = new Embed({ title: "Send `farm start <region>` to start farming!" })
        }
      }
      if (0 !== count) {
        myEmbeds.push(embed.showContent())
      }

      return await EmbedPaginator.createPaginationEmbed(message, myEmbeds)
    } else {
      const region = args.join(" ").toLowerCase()
      if (!isValidCountry(region)) {
        return message.send(new Embed().uhoh(`Couldn't find **"${region}"** anywhere on a map... maybe try somewhere else?`))
      }
      const farmers = getFarmers(region)
      const newUser = User.fromUserData(userdata, message.author)
      newUser.updated = true
      newUser.requestAmount = 9
      newUser.requestTimeOut = 0
      newUser.region = {
        name: region,
        flag: flags[region]
      }
      if (farmers === undefined) {
        return message.send("Something went wrong. Please report this in the official Farmbot discord server.")
      }
      newUser.farmers = farmers
      for (let i = 0; i < 9; ++i) {
        newUser.newRequest()
      }
      await bot.database.Userdata.findOneAndDelete({ userID: userdata.userID })
      await bot.database.Userdata.insertOne(newUser)
      message.send(new Embed()
        .setTitle(`Welcome back to ${bot.user.username}, ${message.author.username}!  ${flags[region]}`)
        .setDescription("See `farm village` to look at your new village!")
        .setColor(bot.color.lightgreen)
      )
    }
  }, {
    permissionLevel: CONSTANTS.PERMISSIONS.EVERYONE,
    category: CONSTANTS.CATEGORIES.FARMING,
    requiresUser: true
  })
}