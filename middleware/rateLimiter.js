import { rateLimit } from "express-rate-limit";
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  message: "To many requests from this IP, please try again after 15 minutes",
  limit: 100,
  ipv6Subnet: 56,
  handler: (req, res, next) => {
    const err = new Error("Too many requests, from " + req.ip);
    err.statusCode = 429;
    err.details =
      "User have exceeded the number of allowed requests. Please try again after the specified time.";
    next(err);
  },
});
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
  limit: 10,
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive,
  handler: (req, res, next) => {
    const err = new Error("Too many auth requests, from " + req.ip);
    err.statusCode = 429;
    err.details =
      "User have exceeded the number of allowed auth requests. Please try again after the specified time.";
    next(err);
  },
});
