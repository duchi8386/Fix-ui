const express = require("express");
const {getQuizWithQuestion, submitQuiz} = require("../controller/quiz.controller");
const {authMiddleware, userAuthorities} = require("../middleware/auth.middleware");


const router = express.Router();

router.get("/questions", authMiddleware, userAuthorities, getQuizWithQuestion);
router.post("/submit", authMiddleware, userAuthorities, submitQuiz);
module.exports = router;