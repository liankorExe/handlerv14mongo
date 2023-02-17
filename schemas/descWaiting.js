const mongoose = require("mongoose")

const descWaiting = new mongoose.Schema({
    messageID: { type: String },
    serverID: { type: String },
})

const model = mongoose.model("descWaiting", descWaiting)

module.exports = model;