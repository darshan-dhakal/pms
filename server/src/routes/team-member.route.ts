import express from "express";
import { TeamMemberController } from "../controllers/team-member.controller";
import { authenticate, teamManagement } from "../middleware/auth.middleware";

export const teamMemberRoutes = express.Router();

// Add and remove members - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER
teamMemberRoutes.post(
  "/",
  authenticate,
  teamManagement,
  TeamMemberController.addMemberToTeam
);

teamMemberRoutes.delete(
  "/:userId/:teamId",
  authenticate,
  teamManagement,
  TeamMemberController.removeMemberFromTeam
);

// Read operations - All authenticated users
teamMemberRoutes.get(
  "/team/:teamId",
  authenticate,
  TeamMemberController.getTeamMembers
);

teamMemberRoutes.get(
  "/user/:userId",
  authenticate,
  TeamMemberController.getUserTeams
);

// Update member role - Limited to SUPER_ADMIN, ADMIN, PROJECT_MANAGER
teamMemberRoutes.patch(
  "/:userId/:teamId",
  authenticate,
  teamManagement,
  TeamMemberController.updateMemberRole
);
