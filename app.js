import express from "express";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

app.use("/auth", authRoutes);

app.listen(3000, () => console.log("listining on port 3000"));
