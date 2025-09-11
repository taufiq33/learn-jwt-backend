import { DataTypes } from "sequelize";
import DB from "../config/Database.js";

export const UserModel = DB.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.TEXT,
  },
});
