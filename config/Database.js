import { Sequelize } from "sequelize";

const DB = new Sequelize("jwt-backend", "admin", "password123", {
  host: "localhost",
  dialect: "mariadb",
});

export default DB;
