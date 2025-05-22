const { Poll } = require("../models/polls.model");

const getpolls = async (req, res) => {
    const polls = await Poll.findAll({});
    const parsedPolls = polls.map((pool) => {
        return {
            title: pool.title,
            description: pool.description,
        };
    });

    res.send(parsedPolls);
};

const registerpolls = async (req, res) => {
    //+ Recibir usuario y password
    // Hashear password
    // Guardar usuario en la db
    const id = req.body.id;
    const title = req.body.title;
    const description = req.body.description;
    try {
        const createdPoll = new Poll({
            id: id,
            title: title,
            description: description,
        });
        await createdPoll.save();
        //const hashedPassword = bcryptjs.hashSync(password);
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

module.exports = { getpolls, registerpolls };
