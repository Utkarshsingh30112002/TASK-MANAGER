import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config.js";

export default function (req, res, next) {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      const err = new Error("jwt token required");
      err.statusCode = 401;
      err.details = "You must be logged in to access this resource";
      return next(err);
    }
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      const err = new Error("Invalid Token");
      err.statusCode = 401;
      err.details = "The token you provided is invalid";
      return next(err);
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
}
