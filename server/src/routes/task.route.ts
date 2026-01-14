import express from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

export const taskRoutes = express.Router();

// Task routes - All require authentication
taskRoutes.post("/", authenticate, TaskController.createTask);

taskRoutes.get("/", authenticate, TaskController.getAllTasks);

taskRoutes.get(
  "/project/:projectId",
  authenticate,
  TaskController.getTasksByProject
);

taskRoutes.get("/:id", authenticate, TaskController.getTaskById);

taskRoutes.patch("/:id", authenticate, TaskController.updateTask);

taskRoutes.delete("/:id", authenticate, TaskController.deleteTask);
