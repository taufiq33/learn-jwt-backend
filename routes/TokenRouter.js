import express from "express";
import { requestNewAccessToken } from "../controllers/TokenController.js";

const tokenRouter = express.Router();

tokenRouter.get("/", requestNewAccessToken);

export default tokenRouter;
