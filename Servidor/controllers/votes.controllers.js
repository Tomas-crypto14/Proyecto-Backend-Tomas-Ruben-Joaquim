const { Vote } = require("../models/votes.model");
//const bcryptjs = require("bcryptjs");
//const jsonwebtoken = require("jsonwebtoken");
//const { JWT_SECRET } = require("../config");

const register = async (req, res) => {
    //+ Recibir usuario y password
    // Hashear password
    // Guardar usuario en la db
    const id = req.body.id;
    const question = req.body.question;
    const options = req.body.options;
    const timestamp = req.body.timestamp;
    try {
        const createdVote = new Vote({
            id: id,
            question: question,
            options: options,
            timestamp: timestamp
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
module.exports = { register };
