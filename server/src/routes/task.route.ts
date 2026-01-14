import express from "express";
import { TaskController } from "../controllers/task.controller";
import { authenticate, taskAssignment } from "../middleware/auth.middleware";

export const taskRoutes = express.Router();

// Create task - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, TEAM_LEAD
taskRoutes.post("/", authenticate, taskAssignment, TaskController.createTask);

// Read operations - All authenticated users
taskRoutes.get("/", authenticate, TaskController.getAllTasks);

taskRoutes.get(
  "/project/:projectId",
  authenticate,
  TaskController.getTasksByProject
);

taskRoutes.get("/:id", authenticate, TaskController.getTaskById);

// Update task (including assignment) - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, TEAM_LEAD
taskRoutes.patch(
  "/:id",
  authenticate,
  taskAssignment,
  TaskController.updateTask
);

// Delete task - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER, TEAM_LEAD
taskRoutes.delete(
  "/:id",
  authenticate,
  taskAssignment,
  TaskController.deleteTask
);
