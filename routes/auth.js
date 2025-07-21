import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import db from "../db/models/index.js";
import jwt from 'jsonwebtoken'

const User = db.User;

const router = express.Router();

const createUserSchema = z.object({
  username: z.string().min(4).max(16),
  email: z.email(),
  password: z
    .string()
    .min(8, "password min length is 8")
    .max(16, "password max length is 16"),
});

router.post("/signup", async (req, res) => {
  try {
    console.log("here");
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(501).send(result.error.message);
      return;
    }
    const { username, password, email } = result.data;
    const hashedPass = await bcrypt.hash(password, 5);
    const user = await User.create({
      username,
      email,
      password: hashedPass,
    });

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('signin',async(req,res)=>{

})
export default router;
