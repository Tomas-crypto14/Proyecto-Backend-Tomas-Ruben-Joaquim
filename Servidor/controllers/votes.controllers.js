const { Vote } = require("../models/votes.model");

// POST /register
const register = async (req, res) => {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options)) {
        return res.status(400).json({ error: "Falta pregunta u opciones" });
    }

    const formattedOptions = options.map((opt) => ({ text: opt, votes: 0 }));

    try {
        const created = await Vote.create({
            question,
            options: formattedOptions,
            voted: [],
        });
        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la votación" });
    }
};

// GET /votings
const getAllVotings = async (req, res) => {
    try {
        const votings = await Vote.find({}, { _id: 1, question: 1 });
        res.json(votings);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener votaciones" });
    }
};

// GET /votings/:id
const votings = async (req, res) => {
    const { id } = req.params;
    const votes = await Vote.findById(id);
    if (!votes) {
        return res.status(404).json({ error: "Voto no encontrado" });
    }
    res.json(votes);
};

// PATCH /register/:id
const vote = async (req, res) => {
    const { optionIndex } = req.body;
    const userIp = req.ip;

    try {
        const voting = await Vote.findById(req.params.id);
        if (!voting)
            return res.status(404).json({ error: "Votación no encontrada" });

        // Evitar voto duplicado
        if (voting.voted.includes(userIp)) {
            return res.status(403).json({ error: "Ya has votado" });
        }

        // Sumar voto
        voting.options[optionIndex].votes += 1;
        voting.voted.push(userIp);

        await voting.save();
        res.json({ message: "Voto registrado", voting });
    } catch (err) {
        res.status(500).json({ error: "Error al votar" });
    }
};

module.exports = { register, getAllVotings, votings, vote };
