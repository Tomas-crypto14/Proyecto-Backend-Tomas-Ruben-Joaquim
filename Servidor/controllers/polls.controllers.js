const { Poll } = require("../models/polls.model");

const getPolls = async (req, res) => {
    try {
        const polls = await Poll.find({});
        const parsedPolls = polls.map((poll) => ({
            _id: poll._id,
            title: poll.question,
            options: Object.entries(poll.options).map(([name, votes]) => ({
                name,
                votes,
            })),
        }));

        res.json(parsedPolls);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener las encuestas");
    }
};

const registerPolls = async (req, res) => {
    console.log("REQ.BODY:", req.body);
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
