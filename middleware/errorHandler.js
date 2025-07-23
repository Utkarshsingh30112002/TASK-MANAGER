import logger from "../services/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error(err);
  res.status(err.statusCode || 500).send({
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
  return;
}
