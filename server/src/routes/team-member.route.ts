import express from "express";
import { TeamMemberController } from "../controllers/team-member.controller";
import { authenticate } from "../middleware/auth.middleware";

export const teamMemberRoutes = express.Router();

// Team Member routes - All require authentication
teamMemberRoutes.post("/", authenticate, TeamMemberController.addMemberToTeam);

teamMemberRoutes.delete(
  "/:userId/:teamId",
  authenticate,
  TeamMemberController.removeMemberFromTeam
);

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

teamMemberRoutes.patch(
  "/:userId/:teamId",
  authenticate,
  TeamMemberController.updateMemberRole
);
