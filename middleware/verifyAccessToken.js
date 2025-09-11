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
    validateJwt(accessToken, "access", async (error, decoded) => {
      if (error && error.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "accToken Expired" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.sendStatus(500);
  }
}
