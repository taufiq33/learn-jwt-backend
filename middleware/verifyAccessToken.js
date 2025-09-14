import { validateJwt } from "../utils/token.js";

export async function verifyAccessToken(req, res, next) {
  const auth = req.headers?.authorization;
  if (!auth) {
    return res.sendStatus(401);
  }

  const accessToken = auth.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }
  eda;
  try {
    const decoded = await validateJwt(accessToken, "access");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "token expired" });
    }
    return res.status(401).json({ msg: "invalid token " });
  }
}
