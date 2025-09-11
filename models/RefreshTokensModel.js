import { DataTypes } from "sequelize";
import DB from "../config/Database.js";
import { UserModel } from "./UserModel.js";

export const RefreshTokensModel = DB.define("refreshTokens", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: "users",
      key: "id",
    },
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sessionLabel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

RefreshTokensModel.belongsTo(UserModel, { foreignKey: "userId" });
UserModel.hasMany(RefreshTokensModel, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
