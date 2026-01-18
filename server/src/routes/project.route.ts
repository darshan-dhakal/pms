import express from "express";
import { ProjectController } from "../controllers/project.controller";
import {
  authenticate,
  adminOnly,
  checkEmailVerified,
} from "../middleware/auth.middleware";

export const projectRoutes = express.Router();

// Project routes - All require authentication
projectRoutes.post(
  "/",
  authenticate,
  checkEmailVerified,
  ProjectController.createProject,
);

projectRoutes.get("/", authenticate, ProjectController.getAllProjects);

projectRoutes.get(
  "/team/:teamId",
  authenticate,
  ProjectController.getProjectsByTeam,
);

projectRoutes.get("/:id", authenticate, ProjectController.getProjectById);

projectRoutes.patch("/:id", authenticate, ProjectController.updateProject);

projectRoutes.delete("/:id", authenticate, ProjectController.deleteProject);
