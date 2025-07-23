import express from "express";
import bcrypt from "bcrypt";
import db from "../db/models/index.js";
import jwt from "jsonwebtoken";
import { createUserSchema, signinUserSchema } from "../zod/user.schema.js";
import { jwtSecret } from "../config/config.js";
import logger from "../services/logger.js";

const User = db.User;

export async function signupUser(req, res, next) {
  try {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      const err = new Error(result.error.message);
      err.details = result.error.errors;
      err.statusCode = 400;
      return next(err);
    }
    const { username, password, email } = result.data;
    const hashedPass = await bcrypt.hash(password, 5);
    const user = await User.create({
      username,
      email,
      password: hashedPass,
    });
    logger.info(`User created with ID: ${user.id} and username: ${username}`);
    res.status(201).send(user);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      const error = new Error("Username or email already exists");
      error.statusCode = 409;
      error.details = err.errors;
      return next(error);
    }
    err.statusCode = 500;
    err.message = "Internal Server Error";
    console.log(err);
    next(err);
  }
}

export async function signinUser(req, res, next) {
  try {
    const result = signinUserSchema.safeParse(req.body);
    if (!result.success) {
      const err = new Error(result.error.message);
      err.details = result.error.errors;
      err.statusCode = 400;
      return next(err);
    }
    const { username, password } = result.data;
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user || !user.password) {
      const err = new Error("User not found");
      err.statusCode = 404;
      err.details = "User with this username does not exist";
      return next(err);
    }
    const userCheck = await bcrypt.compare(password, user.password);

    if (!userCheck) {
      const err = new Error("Incorrect password");
      err.statusCode = 401;
      err.details = "The password you entered is incorrect";
      return next(err);
    }

    const token = jwt.sign({ username, id: user.id }, jwtSecret);
    res.cookie("authToken", token);
    logger.info(`User signed in with ID: ${user.id} and username: ${username}`);
    res.send({ message: "Signin Successfull", token });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Internal Server Error";
    next(err);
  }
}
