const port = 8000;

const cors = require("cors");
const express = require("express");

//const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("./swagger-output.json");

const { dbConnection } = require("./db");

const usersRoutes = require("./routes/users.routes");
const votesRoutes = require("./routes/votes.routes");
const pollsRoutes = require("./routes/polls.routes");

const main = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/", usersRoutes);
    app.use("/votes", votesRoutes);
    app.use("/polls", pollsRoutes);
    //app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    dbConnection();
    app.listen(port, () => {
        console.log(`App listening on ${port}`);
    });
};

main();
