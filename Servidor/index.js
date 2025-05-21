const port = 8000;

const cors = require("cors");
const express = require("express");
//const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("./swagger-output.json");
const { dbConnection } = require("./db");
const { auth } = require("./middlewares/auth");
const recipesRoutes = require("./routes/recipes.routes");
const ingredientsRoutes = require("./routes/ingredients.routes");
const usersRoutes = require("./routes/users.routes");

const main = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use("/recipes", auth, recipesRoutes);
    app.use("/ingredients", auth, ingredientsRoutes);
    app.use("/", usersRoutes);
    //app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    dbConnection();
    app.listen(port, () => {
        console.log(`App listening on ${port}`);
    });
};

main();
