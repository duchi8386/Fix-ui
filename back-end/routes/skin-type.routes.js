const express = require("express");
const {getSkinTypes} = require("../controller/skin-type.controller");


const router = express.Router();

router.get("/", getSkinTypes);

module.exports = router;