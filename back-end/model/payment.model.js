const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    method: { type: String, enum: ["Credit Card", "Bank Transfer", "COD"], required: true },
    status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
