const express = require("express");

const router = express.Router();
const { register } = require("../controllers/votes.controllers");
const { votings } = require("../controllers/votes.controllers");

router.post("/register", register);
router.get("/votings/:id", votings);
module.exports = router;
