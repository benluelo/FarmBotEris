const chalk = require("chalk")
const cropData = require("../../lib/crop-data.js")
const emoji = require("../../lib/emoji.json")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
exports.run = async (bot) => {
  bot.addCommand("plots", (message) => {

    // attempt to find the user in the system
    bot.getUser(message.author.id, (err, userdata) => {
      if (err) { bot.log.error(err) }

      // if the user IS in the database, do stuff
      if (userdata) {

        // grab farm variable
        const userFarm = userdata.farm

        // initialize message variables
        let plotsMsg = "" // top of message (numbers)
        let plotsMsgTop = "<:blank:645355907206742023>" // rest of message (letters and plots)

        // send message to let the user know the farm is being built, then build the farm
        message.send("Building farm...").then((msg) => {
          for (const plot in userFarm) {
            if (bot.ENV.DEBUG === "true") { console.log(chalk.keyword("brown")("CHECKING PLOT #"), plot) }

            /**
             * @private
             * Farm format:
             *   1 2 3 4 5
             * A * * * * *
             * B * * * * *
             * C * * * * *
             * D * * * * *
             * E * * * * *
             */

            // adds the letters and numbers as they are needed
            if (5 > plot) {
              plotsMsgTop += emoji.numbers[plot]
            }
            if (plot % 5 === 0) {
              plotsMsg += "\n" + emoji.letters[Math.floor(plot / 5)]
            }

            if (bot.ENV.DEBUG === "true") { console.log(userFarm[plot].crop.planted) }

            // adds the plots to the message
            if (userFarm[plot].crop.planted == "dirt") { // if dirt, add dirt (lol)
              plotsMsg += emoji.dirt
            } else if (parseInt(Date.now() - userFarm[plot].crop.datePlantedAt) >= parseInt(bot.config.farminfo.growTimes[userFarm[plot].crop.planted])) { // if not dirt, and if the crop is grown, add the crop
              plotsMsg += cropData[userFarm[plot].crop.planted].emoji
            } else { // if the crop in the plot isn't grown, add a seedling
              plotsMsg += emoji.seedling
            }

            if (bot.ENV.DEBUG === "true") { console.log("Now:", Date.now()) }
            if (bot.ENV.DEBUG === "true") { console.log("Planted at:", userFarm[plot].crop.datePlantedAt) }
            if (bot.ENV.DEBUG === "true") { console.log("Time Difference:", (Date.now() - userFarm[plot].crop.datePlantedAt)) }
          }

          // edit the originally sent message
          msg.edit(
            {
              ...new bot.Embed().setAuthor(`${message.author.username}'s farm!`, null, message.author.avatarURL).setDescription(`${plotsMsgTop + plotsMsg}`).setColor(bot.color.lightgreen),
              ...{ content: "" }
            }
          )
        })
      } else {
        bot.startMessage(message)
      }
    })

  })
}