import { Router } from "express";
import {
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/UserController.js";
import { verifyAccessToken } from "../middleware/verifyAccessToken.js";

const userRouter = Router();

userRouter.get("/", verifyAccessToken, getUsers);
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.delete("/logout", logoutUser);

export default userRouter;
