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

  try {
    const decoded = await validateJwt(accessToken, "access");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "acctoken expired" });
    }
    return res.status(401).json({ msg: "invalid token " });
  }
}
