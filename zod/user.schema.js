import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(4, "username must be at least 4 characters long").max(16, "username must be between 4 and 16 characters"),
  email: z.email(),
  password: z
    .string()
    .min(8, "password min length is 8")
    .max(16, "password max length is 16"),
});

export const signinUserSchema=z.object({
  username:z.string().min(4, "username must be at least 4 characters long").max(16, "username must be between 4 and 16 characters"),
  password: z
    .string()
    .min(8, "password min length is 8")
    .max(16, "password max length is 16"),
})

