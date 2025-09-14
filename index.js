import express from "express";
import morgan from "morgan";
import userRouter from "./routes/UserRouter.js";
import DB from "./config/Database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import tokenRouter from "./routes/TokenRouter.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5225" }));
app.use("/api/users", userRouter);
app.use("/api/token", tokenRouter);

app.listen(5000, async () => {
  console.log("server running on 5000");
  try {
    await DB.authenticate();
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection error");
  }
});
