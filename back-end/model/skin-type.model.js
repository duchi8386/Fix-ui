const mongoose = require("mongoose");

const SkinTypeSchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true },
    description: { type: String }
});

module.exports = mongoose.model("SkinType", SkinTypeSchema);
