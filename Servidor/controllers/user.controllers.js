const { User } = require("../models/user.model");
const bcryptjs = require("bcryptjs");
//const jsonwebtoken = require("jsonwebtoken");
//const { JWT_SECRET } = require("../config");
const login = async (req, res) => {
    const { username, password } = req.body;

    //const hashedPassword = bcryptjs.hashSync(password);
    //res.send(hashedPassword);
    //return;

    const user = await User.findOne({ username: username });
    console.log(user);
    if (!user) {
        res.status(404).send("INCORRECT_USERNAME");
    }
    const isPasswordMatch = bcryptjs.compareSync(password, user.password);
    if (!isPasswordMatch) {
        res.status(400).send("INCORRECT_USER_OR_PASSWORD");
        return;
    }
    //USUARIO Y PASSWORD VALIDO
    // Generar un token con el userId en el payload .sign()
    // y un jwt secret
    //let token = jwt.sign({ id: createdMember.id }, jwt_secret);
    //const accessToken = jsonwebtoken.sign({ userId: user._id }, JWT_SECRET);
    //res.send(accessToken);
    //res.status(201).send({ llave: createdMember.id });
    //res.status(201).send({ token: token });
};
// Recibir username y password
// Validar que el username exista
// Validar que el password de ese username sea el mismo
// que el recibido
// Generar un token con el userId en el payload .sign()
// y un jwt secret

const register = async (req, res) => {
    //+ Recibir usuario y password
    // Hashear password
    // Guardar usuario en la db
    const username = req.body.username;
    const userpassword = req.body.password;
    const hashedPassword = bcryptjs.hashSync(userpassword);

    try {
        const createdUser = new User({
            username: username,
            password: hashedPassword,
        });
        await createdUser.save();
        //const hashedPassword = bcryptjs.hashSync(password);
        res.status(201).send("User registered");
    } catch (error) {
        console.error(error);
        if (error.errorResponse.errmsg) {
            res.status(500).send(error.Response.errmsg);
        } else {
            res.status(500).send("Unexpected error");
        }
    }
    //res.status(201).send({ id: createdMember.id });
};
module.exports = { login, register };