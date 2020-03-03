require("dotenv").config({ path: ".env" })
const express = require("express")
const path = require("path")
const exphbs = require("express-handlebars")
const app = express()

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

// homepage Route
app.get("/", (req, res) => res.render("index", {
  title: "FarmBot"
}))

// userdata Route
app.get("/userdata", (req, res) => res.render("userdata", {
  title: "UserData Test"
}))

app.listen(4999, () => {

})