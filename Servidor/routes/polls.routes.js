const express = require("express");
const router = express.Router();
const action = require("../controllers/polls.controllers");

router.post("/register", action.registerPolls);
router.get("/getpolls", action.getPolls);

module.exports = router;
