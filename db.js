const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: 5433,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./models/user")(sequelize, Sequelize);
db.games = require("./models/game")(sequelize, Sequelize);

module.exports = db;
