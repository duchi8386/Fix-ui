const express = require("express");
const {getUserById, getUsers, updateUserStatus} = require("../controller/user.controller");
const {adminAuthorities, authMiddleware} = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, adminAuthorities, getUsers);
router.get("/:id", getUserById);
router.put("/:userId/status",authMiddleware, adminAuthorities, updateUserStatus); // Cập nhật trạng thái user


module.exports = router;