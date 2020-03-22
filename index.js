require("dotenv").config({ path: ".env" })
const express = require("express")
const fetch = require("node-fetch")
const path = require("path")
const exphbs = require("express-handlebars")
const cookieParser = require("cookie-parser")
const twemoji = require("twemoji")
twemoji.ext = ".svg"
const app = express()

const PORT = 4000 || process.env.PORT

let cropData
;(async () => {
  const data = await fetch("http://54.218.80.236:5000/crop-data")
  cropData = await data.json()
})()

app.use(cookieParser())
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  helpers: {
    test: function () {
      return this.loggedIn
    }
  }
}))
app.set("view engine", "handlebars")

app.use(function(req, res, next){
  console.log("cookies", req.cookies)
  const loggedIn = req.cookies.userID ? true : false
  res.locals.loggedIn = loggedIn
  next();
})

// homepage route
app.get("/", async (req, res) => {
  res.render("index", {
    title: "FarmBot Home"
  })
})

// userdata page
app.get("/profile", async (req, res) => {
  if (req.cookies.userID) {
    const givenUserID = req.cookies.userID

    let userdataget
    await fetch(`http://54.218.80.236:5000/getUserData/${givenUserID}/1a40715b-8963-4eb2-bde9-b8d2c0b16cbf`).then(res => res.json()).then(json => userdataget = json)

    const emoji = {
      numbers: [
        "1⃣",
        "2⃣",
        "3⃣",
        "4⃣",
        "5⃣"
      ],
      letters: [
        "🇦",
        "🇧",
        "🇨",
        "🇩",
        "🇪"
      ],
      dirt: "🟫",
      seedling: "🌱"
    }

    userdataget.farmWEB = ((userFarm) => {
      console.log(userFarm)
      const growTimes = {
        apple: 30000,
        orange: 300000,
        lemon: 900000,
        pear: 1800000,
        cherry: 3600000,
        peach: 5400000,
        mango: 10800000,
        melon: 16200000,
        grapes: 25200000,
        strawberry: 34200000,
        banana: 37800000,
        pineapple: 43200000
      }
      let plots = []
      const plotNumbers = [
        {
          url: "",
          isPlot: false
        },
        {
          url: "",
          isPlot: false
        },
        {
          url: "",
          isPlot: false
        },
        {
          url: "",
          isPlot: false
        },
        {
          url: "",
          isPlot: false
        },
        {
          url: "",
          isPlot: false
        }
      ]
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
      for (const plot in userFarm) {
        // adds the letters and numbers as they are needed
        if (plot < 5) {
          plotNumbers[parseInt(plot) + 1].url = twemoji.parse(emoji.numbers[plot], {
            folder: "svg"
          }).replace("\u20e3", "")
        }
        if (plot % 5 === 0) {
          plots.push({
            url: twemoji.parse(emoji.letters[Math.floor(plot / 5)], {
              folder: "svg"
            }),
            isPlot: false
          })
        }

        // adds the plots to the message
        if (userFarm[plot].crop.planted == "dirt") { // if dirt, add dirt (lol)
          plots.push({
            url: twemoji.parse(emoji.dirt, {
              folder: "svg"
            }),
            isPlot: true,
            growthTime: 1,
            growthProgress: 1
          })
        } else if (parseInt(Date.now() - userFarm[plot].crop.datePlantedAt) >= parseInt(growTimes[userFarm[plot].crop.planted])) { // if not dirt, and if the crop is grown, add the crop
          plots.push({
            url: twemoji.parse(cropData[userFarm[plot].crop.planted].emoji, {
              folder: "svg"
            }),
            isPlot: true,
            growthTime: 1,
            growthProgress: 1
          })
        } else { // if the crop in the plot isn't grown, add a seedling
          plots.push({
            url: twemoji.parse(emoji.seedling, {
              folder: "svg"
            }),
            isPlot: true,
            growthTime: parseInt(growTimes[userFarm[plot].crop.planted]),
            growthProgress: parseInt(userFarm[plot].crop.datePlantedAt)
          })
        }
      }
      return plotNumbers.concat(plots)
    })(userdataget.farm)

    res.render("userdata", {
      title: "Userdata",
      userdata: userdataget
    })
  } else {
    res.render("login", {})
  }
})

app.get("/login/:uuid([0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}).:userID(\\d{18})", async (req, res) => {
  res.cookie("userID", req.params.userID, { expires: new Date(Date.now() + (24 * 3600000 * 365)) })
  console.log(req.params)
  res.redirect("/profile")
})

// kill the terminal
app.get("/fucktheterminal", async(req, res) => {
  process.exit()
})

app.get("/help", async (req, res) => {
  const data = await fetch("http://54.218.80.236:5000/command-info")
  const commandInfo = await data.json()
  console.log(commandInfo)
  ;(function parseCoin(commands) {
    for (cmd in commands) {
      // console.log(commands[cmd])
      commands[cmd].description = commands[cmd].description.replace("<:farmbot_coin:648032810682023956>", "<img class=\"emoji\", src=\"images/farmbot_coin.svg\", alt=\"money\">")
      console.log(commands[cmd].description)
      if (commands[cmd].subcommands) {
        parseCoin(commands[cmd].subcommands)
      }
    }
  })(commandInfo)
  res.render("help", {
    title: "FarmBot Help",
    commands: commandInfo
  })
})

app.listen(PORT, () => {
  console.log(`Web Server running on port: ${PORT}`)
})

app.use(express.static(__dirname + '/public'))