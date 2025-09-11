import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel.js";
import { RefreshTokensModel } from "../models/RefreshTokensModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRED,
  validateJwt,
} from "../utils/token.js";

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

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "please fill all field [email, password, ]",
    });
  }

  const userExist = await UserModel.findOne({ where: { email: email } });
  if (!userExist) {
    return res.status(401).json({
      msg: "invalid credentials",
    });
  }

  try {
    const verifyPassword = await bcrypt.compare(password, userExist.password);
    if (!verifyPassword) {
      return res.status(401).json({
        msg: "invalid credentials",
      });
    }

    const accessToken = generateAccessToken({
      email,
      id: userExist.id,
      username: userExist.username,
    });

    const refreshToken = generateRefreshToken({
      email,
      id: userExist.id,
      username: userExist.username,
    });

    const updateRefreshTokenDB = await RefreshTokensModel.create({
      userId: userExist.id,
      token: refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRED),
      sessionLabel: req.headers["user-agent"] || "unknown device",
    });

    res.cookie("refresh-token", refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRED,
      httpOnly: true,
    });

    res.json({
      msg: "login done",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    console.log(error.name);
    return res.status(error.code || 500).json({
      msg:
        error.errors?.map((item) => item.message) ||
        error.msg ||
        "internal server error",
    });
  }
}

export async function logoutUser(req, res) {
  const refreshToken = req.cookies?.["refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ msg: "not authorized" });
  }

  try {
    validateJwt(refreshToken, "refresh", async (error, decoded) => {
      if (error && error.name === "JsonWebTokenError") {
        return res.status(400).json({ msg: "invalid token" });
      }

      const sessionExist = await RefreshTokensModel.findOne({
        where: {
          userId: decoded.id,
          token: refreshToken,
          isRevoked: false,
        },
      });

      if (!sessionExist) {
        return res.status(400).json({ msg: "invalid token" });
      }

      const [revokeSession] = await RefreshTokensModel.update(
        { isRevoked: true },
        { where: { id: sessionExist.id } }
      );

      if (revokeSession === 0) {
        throw Error("internal error DB");
      }

      res.clearCookie("refresh-token");

      return res.json({ msg: "logout done" });
    });
  } catch (error) {
    console.log(error);
    console.log(error.name);
    return res.status(error.code || 500).json({
      msg:
        error.errors?.map((item) => item.message) ||
        error.msg ||
        "internal server error",
    });
  }
}
