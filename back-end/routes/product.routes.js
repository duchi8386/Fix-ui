const express = require("express");
const {createProduct, getProducts, getProductDetail, updateProduct, getActiveProductForUser, toggleProductStatus} = require("../controller/product.controller");
const {uploadProduct} = require("../middleware/upload.middleware");
const {adminAuthorities, authMiddleware} = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/product-list/active", getActiveProductForUser);
router.get("/", authMiddleware, adminAuthorities ,getProducts);
router.get("/:id", getProductDetail);
router.post("/", authMiddleware, adminAuthorities, uploadProduct.single("image"), createProduct);
router.put("/:id", authMiddleware, adminAuthorities, uploadProduct.single("image"), updateProduct);
router.patch("/:id/status", authMiddleware, adminAuthorities, toggleProductStatus);

module.exports = router;