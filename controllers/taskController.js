import express from "express";
import {
  createTaskSchema,
  getTaskSchema,
  updateTaskSchema,
} from "../zod/task.schema.js";
import db from "../db/models/index.js";
import { Op } from "sequelize";
import logger from "../services/logger.js";
const Task = db.Task;

const router = express.Router();

export async function createTask(req, res, next) {
  try {
    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    const task = await Task.create({ ...result.data, userId: req.user.id });
    logger.info(`Task created with ID: ${task.id} by user ID: ${req.user.id}`);
    res.status(201).send({ message: "Task created successfully", task });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    const taskId = req.params.id;
    const [updated] = await Task.update(result.data, {
      where: { id: taskId, userId: req.user.id },
    });
    if (!updated) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      err.details = "No task found with the provided ID";
      return next(err);
    }
    logger.info(`Task updated with ID: ${taskId} by user ID: ${req.user.id}`);
    res.send({ message: "Task updated successfully", updated });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}
export async function getTaskByID(req, res, next) {
  try {
    const taskId = req.params.id;
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user.id },
    });
    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      err.details = "No task found with the provided ID";
      return next(err);
    }
    logger.info(`Task retrieved with ID: ${taskId} by user ID: ${req.user.id}`);
    res.send(task);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}

export async function deleteTaskById(req, res, next) {
  try {
    const taskId = req.params.id;
    const deleted = await Task.destroy({
      where: { id: taskId, userId: req.user.id },
    });
    if (!deleted) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      err.details = "No task found with the provided ID";
      return next(err);
    }
    logger.info(`Task deleted with ID: ${taskId} by user ID: ${req.user.id}`);
    res.send({ message: "Task deleted successfully" });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}

export async function getAllTasks(req, res, next) {
  try {
    let { priority, status, dueDate, sortDueDate, sortPriority } = req.query;
    dueDate = dueDate?.split(",");
    const result = getTaskSchema.safeParse({
      priority,
      status,
      dueDate,
      sortDueDate,
      sortPriority,
    });
    if (!result.success) {
      return next(result.error);
    }
    const {
      priority: p,
      status: s,
      dueDate: d,
      sortDueDate: sd,
      sortPriority: sp,
    } = result.data;
    const whereConditions = { userId: req.user.id };
    if (p) whereConditions.priority = p;
    if (s) whereConditions.status = s;
    if (d && d.length === 2) {
      whereConditions.dueDate = {
        [Op.between]: [d[0], d[1]],
      };
    }
    const orderConditions = [];
    if (sd) orderConditions.push(["dueDate", sd]);
    if (sp) orderConditions.push(["priority", sp]);
    const tasks = await Task.findAll({
      where: whereConditions,
      order: orderConditions,
    });
    logger.info(
      `Tasks retrieved by user ID: ${
        req.user.id
      } with filters: ${JSON.stringify(result.data)}`
    );
    res.send(tasks);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}
