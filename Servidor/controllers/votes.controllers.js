const { Vote } = require("../models/votes.model");
//const bcryptjs = require("bcryptjs");
//const jsonwebtoken = require("jsonwebtoken");
//const { JWT_SECRET } = require("../config");

const register = async (req, res) => {
    //+ Recibir usuario y password
    // Hashear password
    // Guardar usuario en la db
    const questions = req.body.questions;
    const options = req.body.options;
    try {
        const createdVote = new Vote({
            questions: questions,
            options: options,
        });
        await createdVote.save();
        //const hashedPassword = bcryptjs.hashSync(password);
        res.status(201).send("Vote registered");
    } catch (error) {
        console.error(error);
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(500).send("Unexpected error");
        }
    }
    //res.status(201).send({ id: createdMember.id });
};

const votings = async (req, res) => {
    const { id } = req.params;
    const votes = await Vote.findById(id);
    if (!votes) {
        return res.status(404).json({ error: "Voto no encontrado" });
    }
    res.json(votes);
};
module.exports = { register, votings };
