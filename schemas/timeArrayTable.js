const mongoose = require("mongoose")

const timeArrayTable = new mongoose.Schema({
    deux: { type: Array },
    quatre: { type: Array },
    six: { type: Array },
    huit: { type: Array },
    douze: { type: Array },
    vingtquatre: { type: Array }
})

const model = mongoose.model("timeArrayTable", timeArrayTable)

module.exports = model;