const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    ingredients: {type: [String]},
    skinType: [{type: mongoose.Schema.Types.ObjectId, ref: "SkinType"}],
    rating: {type: Number, default: 0},
    stock: {type: Number, default: 0},
    imageUrl: {type: String},
    brand: {type: mongoose.Schema.Types.ObjectId, ref: "Brand"},
    status: {type: String, enum: ["active", "inactive"], default: "active"},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Product", ProductSchema);
