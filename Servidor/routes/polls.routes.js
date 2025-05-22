const express = require("express");

const router = express.Router();
const { getpolls, registerpolls } = require("../controllers/polls.controllers");


router.post("/register", registerpolls);
router.get("/getpolls", getpolls);

module.exports = router;