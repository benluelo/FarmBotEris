const regex = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/
const cropData = require("../bot/lib/crop-data.js")
module.exports = (bot) => {
  require("dotenv").config({ path: ".env" })
  const express = require("express")
  const app = express()

  // body Parser Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended:false }))

  // this get request takes in a userID as param (/getUserData/295255543596187650/dda66f15-99c5-41ac-8202-2b94a25a155e) and get their data
  app.get("/getUserData/:userID/:token", async (req, res) => {
    const sentUserID = req.params.userID
    const sentToken = req.params.token

    // this checks for something like:    dda66f15-99c5-41ac-8202-2b94a25a155e   (uuid)
    if (regex.test(sentToken)) {
      await bot.database.Userdata.findOne({ userID: sentUserID }, async (err, userdata) => {
        if (err) {
          res.status(400).json({ msg: `${err}` })
        } else if (!userdata) {
          res.status(400).json({ msg: `No user found with the userID: ${sentUserID}` })
        } else {
          res.json(userdata)
        }
      })
    } else {
      res.status(400).json({ msg: "Invalid token provided" })
    }
  })

  app.get("/command-info", async (req, res) => {
    res.json(bot.Commands.toJSON())
  })

  app.get("/crop-data", async (req, res) => {
    res.json(cropData)
  })

  app.listen(parseInt(process.env.PORT), () => {
    console.log("Web API started on port: " + process.env.PORT)
  })
}