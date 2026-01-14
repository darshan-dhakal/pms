import { Request, Response } from "express";
import { TeamService } from "../services/team.service";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team.dto";

export class TeamController {
  /**
   * Create a new team
   */
  static async createTeam(req: Request, res: Response) {
    try {
      const data: CreateTeamDto = req.body;

      if (!data.name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const team = await TeamService.createTeam(data);

      return res.status(201).json({
        message: "Team created successfully",
        team,
      });
    } catch (error: any) {
      console.error("Create team error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Get team by ID
   */
  static async getTeamById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const team = await TeamService.getTeamById(id);

      return res.status(200).json({
        team,
      });
    } catch (error: any) {
      console.error("Get team error:", error);
      return res.status(404).json({
        message: error.message || "Team not found",
      });
    }
  }

  /**
   * Get all teams
   */
  static async getAllTeams(req: Request, res: Response) {
    try {
      const teams = await TeamService.getAllTeams();

      return res.status(200).json({
        teams,
        total: teams.length,
      });
    } catch (error: any) {
      console.error("Get all teams error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Update team
   */
  static async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTeamDto = req.body;

      const team = await TeamService.updateTeam(id, data);

      return res.status(200).json({
        message: "Team updated successfully",
        team,
      });
    } catch (error: any) {
      console.error("Update team error:", error);
      return res.status(404).json({
        message: error.message || "Team not found",
      });
    }
  }

  /**
   * Delete team
   */
  static async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await TeamService.deleteTeam(id);

      return res.status(200).json({
        message: "Team deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete team error:", error);
      return res.status(404).json({
        message: error.message || "Team not found",
      });
    }
  }
}
