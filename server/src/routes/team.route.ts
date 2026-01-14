import express from "express";
import { TeamController } from "../controllers/team.controller";
import { authenticate, adminOnly } from "../middleware/auth.middleware";

export const teamRoutes = express.Router();

// Team routes - All require authentication
teamRoutes.post("/", authenticate, TeamController.createTeam);

teamRoutes.get("/", authenticate, TeamController.getAllTeams);

teamRoutes.get("/:id", authenticate, TeamController.getTeamById);

teamRoutes.patch("/:id", authenticate, TeamController.updateTeam);

teamRoutes.delete("/:id", authenticate, TeamController.deleteTeam);
