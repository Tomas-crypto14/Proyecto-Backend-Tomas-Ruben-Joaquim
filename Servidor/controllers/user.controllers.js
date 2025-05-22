const { User } = require("../models/user.model");
const bcryptjs = require("bcryptjs");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isPasswordMatch = bcryptjs.compareSync(password, user.password);
        if (!isPasswordMatch) {
            return res
                .status(400)
                .json({ error: "Usuario o contraseña incorrectos" });
        }

        // Usuario válido - puedes devolver un token aquí si lo deseas en el futuro
        res.status(200).json({ message: "Login exitoso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al intentar iniciar sesión" });
    }
};

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password);
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || "Error al registrar usuario",
        });
    }
};

module.exports = { login, register };
