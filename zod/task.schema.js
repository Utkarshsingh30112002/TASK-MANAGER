import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  priority: z.enum(
    ["low", "medium", "high"],
    "Priority must be one of low, medium, or high"
  ),
  status: z.enum(
    ["pending", "in-progress", "completed"],
    "Status must be one of pending, in-progress, or completed"
  ),
});

export const updateTaskSchema = createTaskSchema.partial();

export const getTaskSchema = z.object({
  priority: z
    .enum(
      ["low", "medium", "high"],
      "Priority must be one of low, medium, or high"
    )
    .optional(),
  status: z
    .enum(
      ["pending", "in-progress", "completed"],
      "Status must be one of pending, in-progress, or completed"
    )
    .optional(),
  dueDate: z
    .preprocess((arg) => {
      if (Array.isArray(arg) && arg.length === 2) {
        if (arg[0] > arg[1]) {
          return [new Date(arg[1]), new Date(arg[0])];
        }
        return [new Date(arg[0]), new Date(arg[1])];
      }
      return undefined;
    }, z.tuple([z.date(), z.date()]))
    .optional(),
  sortDueDate: z
    .enum(["asc", "desc"], "sortDueDate must be one of desc or asc")
    .optional(),
  sortPriority: z
    .enum(["asc", "desc"], "sortPriority must be one of desc or asc")
    .optional(),
});
