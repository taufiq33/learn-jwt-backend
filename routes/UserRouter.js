import { Router } from "express";
import {
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/UserController.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/logout", logoutUser);

export default userRouter;
