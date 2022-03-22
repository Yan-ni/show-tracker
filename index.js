const express = require("express");
const morgan = require("morgan");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
const routes = require("./app/routes");
app.use("/api", routes);

// errorHandler middleware
const errorHandler = require("./app/middlewares/errorHandler");
app.use(errorHandler);

// database
const { sequelize } = require("./app/models");

sequelize.sync({ force: false }).then(() => {
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection to the databse has been established successfully."
      );

      const PORT = process.env.port || 5000;
      app.listen(PORT, () =>
        console.log(`server up and running on port ${PORT}`)
      );
    })
    .catch((error) =>
      console.error("Unable to connect to the database: ", error)
    );
});
