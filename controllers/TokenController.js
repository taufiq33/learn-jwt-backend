import { Op } from "sequelize";
import { RefreshTokensModel } from "../models/RefreshTokensModel.js";

import { generateAccessToken, validateJwt } from "../utils/token.js";

export async function requestNewAccessToken(req, res) {
  const refreshToken = req.cookies?.["refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ msg: "not authorized" });
  }

  try {
    const decoded = await validateJwt(refreshToken, "refresh");
    const sessionExist = await RefreshTokensModel.findOne({
      where: {
        userId: decoded.id,
        token: refreshToken,
        isRevoked: false,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!sessionExist) {
      return res.status(401).json({ msg: "invalid/revoked/expired token" });
    }

    const newAccessToken = generateAccessToken({
      email: decoded.email,
      username: decoded.username,
      id: decoded.id,
    });

    return res.json({
      msg: "acc token regenerated",
      access_token: newAccessToken,
    });
  } catch (error) {
    if (error && error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "invalid token" });
    }

    if (error && error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "expired token" });
    }

    return res.status(error.code || 500).json({
      msg:
        error.errors?.map((item) => item.message) ||
        error.msg ||
        "internal server error",
    });
  }
}
