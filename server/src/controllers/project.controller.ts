import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

export class ProjectController {
  /**
   * Create a new project
   */
  static async createProject(req: Request, res: Response) {
    try {
      const data: CreateProjectDto = req.body;

      if (!data.name || !data.teamId) {
        return res.status(400).json({
          message: "Name and teamId are required",
        });
      }

      const project = await ProjectService.createProject(data);

      return res.status(201).json({
        message: "Project created successfully",
        project,
      });
    } catch (error: any) {
      console.error("Create project error:", error);
      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * Get project by ID
   */
  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await ProjectService.getProjectById(id);

      return res.status(200).json({
        project,
      });
    } catch (error: any) {
      console.error("Get project error:", error);
      return res.status(404).json({
        message: error.message || "Project not found",
      });
    }
  }

  /**
   * Get all projects
   */
  static async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await ProjectService.getAllProjects();

      return res.status(200).json({
        projects,
        total: projects.length,
      });
    } catch (error: any) {
      console.error("Get all projects error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Get projects by team
   */
  static async getProjectsByTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;

      const projects = await ProjectService.getProjectsByTeam(teamId);

      return res.status(200).json({
        projects,
        total: projects.length,
      });
    } catch (error: any) {
      console.error("Get projects by team error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * Update project
   */
  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateProjectDto = req.body;

      const project = await ProjectService.updateProject(id, data);

      return res.status(200).json({
        message: "Project updated successfully",
        project,
      });
    } catch (error: any) {
      console.error("Update project error:", error);
      return res.status(404).json({
        message: error.message || "Project not found",
      });
    }
  }

  /**
   * Delete project
   */
  static async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ProjectService.deleteProject(id);

      return res.status(200).json({
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete project error:", error);
      return res.status(404).json({
        message: error.message || "Project not found",
      });
    }
  }
}
