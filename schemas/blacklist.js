const mongoose = require("mongoose")

const blacklist = new mongoose.Schema({
    adshare: { type: String },
    servers: { type: Array },
})

const model = mongoose.model("blacklist", blacklist)

module.exports = model;