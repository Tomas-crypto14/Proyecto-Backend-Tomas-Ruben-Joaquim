const express = require("express");
const router = express.Router();
const {
    register,
    getAllVotings,
    vote,
    votings,
} = require("../controllers/votes.controllers");

router.post("/register", register);
router.get("/votings", getAllVotings);
router.get("/votings/:id", votings);
router.patch("/register/:id", vote);

module.exports = router;
