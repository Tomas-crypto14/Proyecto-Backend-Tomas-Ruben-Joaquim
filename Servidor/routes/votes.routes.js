const express = require("express");
const router = express.Router();
const {
    register,
    getAllVotings,
    votings,
    vote,
} = require("../controllers/votes.controllers");

router.post("/register", register);
router.get("/votings", getAllVotings);
router.get("/votings/:id", votings);
router.patch("/:id", vote);
module.exports = router;