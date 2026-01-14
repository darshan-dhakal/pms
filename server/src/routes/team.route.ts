import express from "express";
import { TeamController } from "../controllers/team.controller";
import { authenticate, teamManagement } from "../middleware/auth.middleware";

export const teamRoutes = express.Router();

// Team creation and member management - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER
teamRoutes.post("/", authenticate, teamManagement, TeamController.createTeam);

// Read operations - All authenticated users
teamRoutes.get("/", authenticate, TeamController.getAllTeams);

teamRoutes.get("/:id", authenticate, TeamController.getTeamById);

// Update and delete - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER
teamRoutes.patch(
  "/:id",
  authenticate,
  teamManagement,
  TeamController.updateTeam
);

teamRoutes.delete(
  "/:id",
  authenticate,
  teamManagement,
  TeamController.deleteTeam
);
