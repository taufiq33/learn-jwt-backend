import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel.js";

export async function getUsers(req, res) {
  res.json({
    msg: "Testing response",
  });
}

export async function registerUser(req, res) {
  const { email, username, password, confirmationPassword } = req.body;

  if (!email || !username || !password || !confirmationPassword) {
    return res.status(400).json({
      msg: "please fill all field [email, username, password, confirmationPassword]",
    });
  }

  if (confirmationPassword !== password) {
    return res.status(400).json({
      msg: "invalid confirmation password",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const insertNewUser = await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.json({
      msg: "register user done",
      user: {
        email: insertNewUser.email,
        username: insertNewUser.username,
        id: insertNewUser.id,
      },
    });
  } catch (error) {
    console.log(error.name);

    if (
      ["SequelizeUniqueConstraintError", "SequelizeValidationError"].includes(
        error.name
      )
    ) {
      error.code = 400;
    }
    return res.status(error.code || 500).json({
      msg:
        error.errors.map((item) => item.message) ||
        error.msg ||
        "internal server error",
    });
  }
}

export async function loginUser(req, res) {}
