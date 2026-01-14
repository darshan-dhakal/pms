import { Request, Response } from "express";
import { TeamMemberService } from "../services/team-member.service";
import { AddTeamMemberDto, UpdateTeamMemberDto } from "../dto/team-member.dto";

export class TeamMemberController {
  /**
   * Add member to team
   */
  static async addMemberToTeam(req: Request, res: Response) {
    try {
      const data: AddTeamMemberDto = req.body;

      if (!data.userId || !data.teamId) {
        return res.status(400).json({
          message: "UserId and teamId are required",
        });
      }

      const member = await TeamMemberService.addMemberToTeam(data);

      return res.status(201).json({
        message: "Member added to team successfully",
        member,
      });
    } catch (error: any) {
      console.error("Add member error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Remove member from team
   */
  static async removeMemberFromTeam(req: Request, res: Response) {
    try {
      const { userId, teamId } = req.params;

      await TeamMemberService.removeMemberFromTeam(userId, teamId);

      return res.status(200).json({
        message: "Member removed from team successfully",
      });
    } catch (error: any) {
      console.error("Remove member error:", error);
      return res.status(404).json({
        message: error.message || "Team member not found",
      });
    }
  }

  /**
   * Get team members
   */
  static async getTeamMembers(req: Request, res: Response) {
    try {
      const { teamId } = req.params;

      const members = await TeamMemberService.getTeamMembers(teamId);

      return res.status(200).json({
        members,
        total: members.length,
      });
    } catch (error: any) {
      console.error("Get team members error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user teams
   */
  static async getUserTeams(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const teams = await TeamMemberService.getUserTeams(userId);

      return res.status(200).json({
        teams,
        total: teams.length,
      });
    } catch (error: any) {
      console.error("Get user teams error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Update member role
   */
  static async updateMemberRole(req: Request, res: Response) {
    try {
      const { userId, teamId } = req.params;
      const data: UpdateTeamMemberDto = req.body;

      if (!data.role) {
        return res.status(400).json({
          message: "Role is required",
        });
      }

      const member = await TeamMemberService.updateMemberRole(
        userId,
        teamId,
        data
      );

      return res.status(200).json({
        message: "Member role updated successfully",
        member,
      });
    } catch (error: any) {
      console.error("Update member role error:", error);
      return res.status(404).json({
        message: error.message || "Team member not found",
      });
    }
  }
}
