const express = require("express");

const {getQuizResults} = require("../controller/result.controller");
const {authMiddleware, userAuthorities} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, userAuthorities, getQuizResults);

module.exports = router;