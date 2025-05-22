const { Poll } = require("../models/polls.model");

const getPolls = async (req, res) => {
    const polls = await Poll.findAll({});
    const parsedPolls = polls.map((pool) => {
        return {
            id: pool.id,
            title: pool.title,
            description: pool.description,
        };
    });

    res.send(parsedPolls);
};

const registerPolls = async (req, res) => {
    const question = req.body.question;
    const options = req.body.options;
    try {
        const createdPoll = new Poll({
            question: question,
            options: options,
            voted: new Array(),
        });
        await createdPoll.save();
        res.status(201).send("Poll registered");
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

module.exports = { getPolls, registerPolls };
