const express = require("express");
const {createReview, getReviewsByProductId, getAllReviews} = require("../controller/review.controller");
const {authMiddleware, userAuthorities, adminAuthorities} = require("../middleware/auth.middleware");

const router = express.Router();

router.get('/all-reviews',authMiddleware, adminAuthorities, getAllReviews);
router.get('/product/:productId', getReviewsByProductId);
router.post("/", authMiddleware, userAuthorities ,createReview);

module.exports = router;