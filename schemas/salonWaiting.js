const mongoose = require("mongoose")

const salonWaiting = new mongoose.Schema({
    messageID: { type: String },
    serverID: { type: String },
    inviteServer: { type: String},
})

const model = mongoose.model("salonWaiting", salonWaiting)

module.exports = model;