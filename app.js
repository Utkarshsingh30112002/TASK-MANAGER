import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";
import verifyToken from "./middleware/verifyToken.js";
import taskRoutes from "./routes/tasks.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./services/logger.js";
import { authLimiter, limiter } from "./middleware/rateLimiter.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    err.statusCode = 500;
    err.message = "Database connection failed";
    logger.error(err);
  });

app.use("/auth", authLimiter, authRoutes);

app.use(verifyToken);

app.use("/tasks", taskRoutes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  err.details = "The requested resource was not found";
  next(err);
});

app.use(errorHandler);

app.listen(3000, () => console.log("listining on port 3000"));
