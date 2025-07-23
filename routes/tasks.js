import express from "express";

import {
  createTask,
  updateTask,
  getTaskByID,
  deleteTaskById,
  getAllTasks,
} from "../controlers/taskController.js";

const router = express.Router();

router.post("/", createTask);

router.put("/:id", updateTask);

router.get("/:id", getTaskByID);

router.delete("/:id", deleteTaskById);

router.get("/", getAllTasks);

export default router;
