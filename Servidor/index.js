const port = 8000;

const cors = require("cors");
const express = require("express");
const votesRoutes = require("./routes/votes.routes");
const usersRoutes = require("./routes/users.routes");
const { dbConnection } = require("./db");

const main = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Rutas de usuarios y votaciones
    app.use("/users", usersRoutes);
    app.use("/votes", votesRoutes);

    dbConnection();
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};

main();
