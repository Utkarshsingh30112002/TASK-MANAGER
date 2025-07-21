import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import sequelize from "../../config/database.js";

const db = {};

// Step 1: Load all model files (excluding index.js)
const modelFiles = fs
  .readdirSync("./db/models")
  .filter((file) => file !== "index.js");

// Step 2: Dynamically import all models
const importPromises = modelFiles.map(async (file) => {
  const module = await import(`./${file}`);
  const model = module.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

await Promise.all(importPromises);

// Step 3: Setup associations
Object.values(db).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

// Step 4: Add sequelize instance to db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
