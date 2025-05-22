const express = require("express");
const router = express.Router();

const { getPolls, registerPolls } = require("../controllers/polls.controllers");

router.post("/", registerPolls);
router.get("/", getPolls);

module.exports = router;
