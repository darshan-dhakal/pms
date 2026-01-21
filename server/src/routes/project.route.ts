import express from "express";
import { ProjectController } from "../controllers/project.controller";
import {
  authenticate,
  checkEmailVerified,
} from "../middleware/auth.middleware";

export const projectRoutes = express.Router();

// ============ PROJECT CRUD ============

// Create project
projectRoutes.post(
  "/",
  authenticate,
  checkEmailVerified,
  ProjectController.createProject,
);

// Get all projects for organization
projectRoutes.get("/", authenticate, ProjectController.getOrganizationProjects);

// Get project by ID
projectRoutes.get("/:id", authenticate, ProjectController.getProjectById);

// Update project
projectRoutes.patch("/:id", authenticate, ProjectController.updateProject);

// ============ PROJECT STATUS ============

// Change project status
projectRoutes.patch(
  "/:id/status",
  authenticate,
  ProjectController.changeProjectStatus,
);

// ============ PROJECT MEMBERS ============

// Add member to project
projectRoutes.post("/:id/members", authenticate, ProjectController.addMember);

// Remove member from project
projectRoutes.delete(
  "/:id/members/:userId",
  authenticate,
  ProjectController.removeMember,
);

// ============ PROJECT MANAGEMENT ============

// Archive project
projectRoutes.post(
  "/:id/archive",
  authenticate,
  ProjectController.archiveProject,
);

// Update project progress
projectRoutes.post(
  "/:id/progress",
  authenticate,
  ProjectController.updateProgress,
);
