const express = require("express");
const {createBrand, getAllBrands} = require("../controller/brand.controller");
const {adminAuthorities, authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/", authMiddleware, adminAuthorities, getAllBrands);
router.post("/", authMiddleware, adminAuthorities, createBrand);

module.exports = router;