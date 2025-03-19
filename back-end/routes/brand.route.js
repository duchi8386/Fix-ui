const express = require("express");
const {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
} = require("../controller/brand.controller");
const {
  adminAuthorities,
  authMiddleware,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminAuthorities, getAllBrands);
router.post("/", authMiddleware, adminAuthorities, createBrand);

router.put(
  "/:id",
  authMiddleware,
  adminAuthorities,
  updateBrand
);
router.delete(
  "/:id",
  authMiddleware,
  adminAuthorities,
  deleteBrand
);

module.exports = router;
