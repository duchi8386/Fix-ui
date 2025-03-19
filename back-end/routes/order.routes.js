const express = require("express");
const {
    getOrderList,
    createOrderWithoutVNPay,
    cancelOrder,
    changeStatusOrder,
    getAllOrders
} = require("../controller/order.controller");
const {authMiddleware, adminAuthorities} = require("../middleware/auth.middleware"); // Middleware xác thực

const router = express.Router();

router.get("/get-all-orders", authMiddleware, adminAuthorities, getAllOrders);
router.get("/", authMiddleware, getOrderList);
router.post("/cod", authMiddleware, createOrderWithoutVNPay);
router.put("/:orderId/cancel", authMiddleware, cancelOrder);
router.put("/:orderId/change-status", authMiddleware, adminAuthorities, changeStatusOrder);

module.exports = router;
