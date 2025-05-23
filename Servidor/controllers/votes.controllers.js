const mongoose = require("mongoose");
const { Vote } = require("../models/votes.model");
const { Poll } = require("../models/polls.model");

// Crear una nueva votación (POST /register)
const register = async (req, res) => {
    const { question, options } = req.body;

    // Revisamos que la pregunta y las opciones existan y sean correctas
    if (!question || !options || !Array.isArray(options)) {
        return res.status(400).json({ error: "Falta pregunta u opciones" });
    }

    // Preparamos las opciones para el modelo Vote (texto + votos en 0)
    const formattedOptions = options.map((opt) => ({ text: opt, votes: 0 }));

    try {
        // Guardamos la nueva votación en la base de datos
        const created = await Vote.create({
            question,
            options: formattedOptions,
            voted: [], // lista de IPs que ya votaron, vacía al inicio
        });
        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear la votación" });
    }
};

// Obtener todas las votaciones (GET /votings)
const getAllVotings = async (req, res) => {
    try {
        // Buscamos todas las votaciones y solo enviamos el id y la pregunta
        const votings = await Vote.find({}, { _id: 1, question: 1 });
        res.json(votings);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener votaciones" });
    }
};

// Obtener una votación específica por ID (GET /votings/:id)
const votings = async (req, res) => {
    try {
        // Buscamos la votación en el modelo Vote
        const voting = await Vote.findById(req.params.id);

        // Si no existe, enviamos error 404
        if (!voting) {
            return res.status(404).json({ error: "Votación no encontrada" });
        }

        res.json(voting);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener la votación" });
    }
};

// Votar en una votación (PATCH /votes/:id)
const vote = async (req, res) => {
    try {
        const id = req.params.id.trim();

        // Validamos que el id sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID de votación no válido" });
        }

        // Buscamos la votación primero en Vote, si no está, buscamos en Poll
        let voting = await Vote.findById(id);
        let modelType = "Vote";

        if (!voting) {
            voting = await Poll.findById(id);
            modelType = "Poll";
        }

        // Si no existe, error 404
        if (!voting) {
            return res.status(404).json({ error: "Votación no encontrada" });
        }

        const { optionIndex } = req.body; // índice de la opción seleccionada
        const userIp = req.ip; // IP del votante

        // Aquí podrías agregar validación para que no vote la misma IP más de una vez
        if (voting.voted.includes(userIp)) {
            return res.status(403).json({ error: "Ya has votado" });
        }

        if (modelType === "Vote") {
            // Si es el modelo Vote, opciones en array (Ruben y Tomas)
            if (
                optionIndex === undefined || // ¿No se ha proporcionado un índice?
                optionIndex < 0 || // ¿Es un número negativo? (índice inválido)
                optionIndex >= voting.options.length // ¿Es mayor o igual al número de opciones disponibles?
            ) {
                return res
                    .status(400)
                    .json({ error: "Índice de opción inválido" });
            }

            // Sumamos 1 al contador de votos de la opción elegida
            voting.options[optionIndex].votes++;
        } else if (modelType === "Poll") {
            // Si es el modelo Poll, opciones en objeto con clave: valor (Squema Joaquim)
            const optionKeys = Object.keys(voting.options);

            if (
                optionIndex === undefined ||
                optionIndex < 0 ||
                optionIndex >= optionKeys.length
            ) {
                return res
                    .status(400)
                    .json({ error: "Índice de opción inválido" });
            }

            // Clave de la opción elegida
            const selectedOption = optionKeys[optionIndex];
            // Sumamos 1 al contador de esa opción
            voting.options[selectedOption]++;

            // Avisamos a Mongoose que el campo 'options' cambió
            voting.markModified("options");
        }

        // Guardamos la IP del votante para que no vote dos veces (si quieres usarlo)
        voting.voted.push(userIp);

        // Guardamos los cambios en la base de datos
        await voting.save();

        // Respondemos con mensaje de éxito y la votación actualizada
        res.json({ message: "Voto registrado correctamente", voting });
    } catch (err) {
        console.error("Error en vote:", err);
        res.status(500).json({ error: "Error al votar" });
    }
};

module.exports = { register, getAllVotings, votings, vote };
