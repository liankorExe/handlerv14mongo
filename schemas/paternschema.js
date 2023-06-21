const mongoose = require("mongoose")

const paternSchema = new mongoose.Schema({
    code: { type: String },
    questions: { type: Array },
    autheur: { type: String },
})

const model = mongoose.model("paternSchema", paternSchema)

module.exports = model;