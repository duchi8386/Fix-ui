const express = require("express");
const {getQuestions} = require("../controller/question.controller");


const router = express.Router();

router.get("/", getQuestions);

module.exports = router;