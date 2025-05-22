const { Poll } = require("../models/polls.model");

const getPolls = async (req, res) => {
    try {
        const polls = await Poll.find();
        const parsedPolls = polls.map((poll) => ({
            id: poll.id,
            title: poll.title,
            description: poll.description,
        }));
        res.send(parsedPolls);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las encuestas" });
    }
};

const registerPolls = async (req, res) => {
    const { id, title, description } = req.body;

    try {
        const createdPoll = new Poll({
            id,
            title,
            description,
        });
        await createdPoll.save();
        res.status(201).send("Poll registered");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar la encuesta" });
    }
};

module.exports = { getPolls, registerPolls };
