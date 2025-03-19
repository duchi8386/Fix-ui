const express = require("express");
const { addToCart, viewCart, removeItemFromCart } = require("../controller/cart.controller");
const { createVNPayPayment, vnpayReturn } = require("../controller/payment.controller");
const {authMiddleware} = require("../middleware/auth.middleware"); // Middleware xác thực

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, viewCart);
router.delete("/remove", authMiddleware, removeItemFromCart);
router.post("/vnpay", authMiddleware, createVNPayPayment);
router.get("/vnpay_return", vnpayReturn);

module.exports = router;
