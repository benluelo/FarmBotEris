require("dotenv").config({ path: ".env" })
const express = require("express")
const fetch = require("node-fetch")
const path = require("path")
const exphbs = require("express-handlebars")
const app = express()

const PORT = 5000 || process.env.PORT

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

// homepage route
app.get("/", async (req, res) => {
  res.render("index", {
    title: "FarmBot Home"
  })
})

// userdata page
app.get("/userdata/:userID", async (req, res) => {
  const givenUserID = req.params.userID

  let userdataget
  await fetch(`http://localhost:5000/getUserData/${givenUserID}/1a40715b-8963-4eb2-bde9-b8d2c0b16cbf`).then(res => res.json()).then(json => userdataget = json)

  res.render("userdata", {
    title: "Userdata",
    userdata: userdataget
  })
})

// login to discord route
app.get("/login", async (req, res) => {
  res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=646399118880669716&redirect_uri=http%3A%2F%2F73.194.182.148%3A4999%2Fcallback&response_type=code&scope=identify")
})

// kill the terminal
app.get("/fucktheterminal", async(req, res) => {
  process.exit()
})

app.get("/help", async(req, res) => {
  res.render("help", {
    title: "FarmBot Help"
  })
})

app.listen(PORT, () => {
  console.log(`Web Server running on port: ${PORT}`)
})

app.use(express.static(__dirname + '/public'))