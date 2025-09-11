import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/UserController.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
