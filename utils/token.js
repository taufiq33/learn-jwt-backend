import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_EXPIRED = 30 * 1000; //30s
export const REFRESH_TOKEN_EXPIRED = 10 * 60 * 1000; // 10m

export function generateAccessToken(payload) {
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRED,
  });

  return accessToken;
}

export function generateRefreshToken(payload) {
  const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRED,
  });

  return refreshToken;
}

export function validateJwt(token, type, callback) {
  if (!type) {
    return false;
  }
  const secret =
    type === "access"
      ? process.env.SECRET_KEY_ACCESS_TOKEN
      : process.env.SECRET_KEY_REFRESH_TOKEN;

  return jwt.verify(token, secret, callback);
}
