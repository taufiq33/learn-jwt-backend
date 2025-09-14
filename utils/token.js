import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_EXPIRED = 30 * 1000; //in miliseconds
export const REFRESH_TOKEN_EXPIRED = 10 * 60 * 1000; // in miliseconds

export function generateAccessToken(payload) {
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRED / 1000, //karena konstanta nya nilainya dalam miliseconds, smntra jwtExpiresIn cmn nerima second saja
  });

  return accessToken;
}

export function generateRefreshToken(payload) {
  const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRED / 1000, //karena konstanta nya nilainya dalam miliseconds, smntra jwtExpiresIn cmn nerima second saja
  });

  return refreshToken;
}

export async function validateJwt(token, type) {
  return new Promise((resolve, reject) => {
    if (!type) {
      return reject("type required");
    }

    const secret =
      type === "access"
        ? process.env.SECRET_KEY_ACCESS_TOKEN
        : process.env.SECRET_KEY_REFRESH_TOKEN;

    return jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return reject(error);
      }

      return resolve(decoded);
    });
  });
}
