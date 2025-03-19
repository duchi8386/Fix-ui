const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    address: { type: String },
    avatarUrl: { type: String },
    skinType: { type: mongoose.Schema.Types.ObjectId, ref: "SkinType" },
    points: { type: Number, default: 0 },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    createdAt: { type: Date, default: Date.now },
    status: {type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE"},
});

module.exports = mongoose.model("User", UserSchema);