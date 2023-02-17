const mongoose = require("mongoose")

const serverSettings = new mongoose.Schema({
    serverID: { type: String },
    description: { type: String },
    salonpub: { type: String }
})

const model = mongoose.model("serverSettings", serverSettings)

module.exports = model;