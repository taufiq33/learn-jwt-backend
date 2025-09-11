import DB from "./config/Database.js";
import { UserModel } from "./models/UserModel.js";
import { RefreshTokensModel } from "./models/RefreshTokensModel.js";

async function migrate() {
  try {
    await DB.authenticate();
    console.log("DB connected.. \n next migrate model");
    await DB.sync({ force: false });
    console.log("DB Migrate done");
  } catch (error) {
    console.log(error);
  }
}

migrate();
