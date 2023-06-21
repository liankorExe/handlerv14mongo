const path = require("path")
const express = require('express')
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, "views")))
app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res) => {
    res.send("coucou ma vie")
})
module.exports = { app, port };