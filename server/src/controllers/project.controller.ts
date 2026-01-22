import { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { ProjectStatus } from "../constant/enums";
import { ProjectRole } from "../entities/project-member.entity";
import {
  ProjectNotFoundError,
  UnauthorizedProjectAccessError,
  InvalidStatusTransitionError,
  DuplicateProjectMemberError,
  ProjectValidationError,
  ArchivedProjectError,
} from "../errors/project.errors";

const projectService = new ProjectService();

export class ProjectController {
  /**
   * POST /api/projects - Create a new project
   */
  static async createProject(req: Request, res: Response) {
    try {
      const { name, description, startDate, endDate } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Use a default organizationId or userId as scope
      const organizationId = "default-org"; // Can be userId for user-scoped projects

      const project = await projectService.createProject({
        name,
        description,
        organizationId,
        ownerId: userId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      return res.status(201).json({
        message: "Project created successfully",
        project,
      });
    } catch (error: any) {
      console.error("Create project error:", error);

      if (error instanceof ProjectValidationError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: error.message || "Internal server error",
      });
    }
  }

  /**
   * GET /api/projects/:id - Get project by ID
   */
  static async getProjectById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const project = await projectService.getProjectById(id, userId);

      return res.status(200).json({
        project,
      });
    } catch (error: any) {
      console.error("Get project error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * GET /api/projects - Get all projects for user
   */
  static async getOrganizationProjects(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Get all projects where user is a member (across all organizations)
      const organizationId = "default-org"; // Or query all user's projects

      const projects = await projectService.getOrganizationProjects(
        organizationId,
        userId,
      );

      return res.status(200).json({
        projects,
        total: projects.length,
      });
    } catch (error: any) {
      console.error("Get organization projects error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * PATCH /api/projects/:id - Update project
   */
  static async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, startDate, endDate } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const project = await projectService.updateProject(id, userId, {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      return res.status(200).json({
        message: "Project updated successfully",
        project,
      });
    } catch (error: any) {
      console.error("Update project error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      if (error instanceof ArchivedProjectError) {
        return res.status(400).json({ message: error.message });
      }

      if (error instanceof ProjectValidationError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * PATCH /api/projects/:id/status - Change project status
   */
  static async changeProjectStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!status || !Object.values(ProjectStatus).includes(status)) {
        return res.status(400).json({
          message: "Valid status is required",
          allowedStatuses: Object.values(ProjectStatus),
        });
      }

      const project = await projectService.changeProjectStatus(
        id,
        userId,
        status,
      );

      return res.status(200).json({
        message: "Project status updated successfully",
        project,
      });
    } catch (error: any) {
      console.error("Change project status error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      if (error instanceof InvalidStatusTransitionError) {
        return res.status(400).json({ message: error.message });
      }

      if (error instanceof ArchivedProjectError) {
        return res.status(400).json({ message: error.message });
      }

      if (error instanceof ProjectValidationError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * POST /api/projects/:id/members - Add member to project
   */
  static async addMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId: memberUserId, role } = req.body;
      const requesterId = req.user?.id;

      if (!requesterId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!memberUserId || !role) {
        return res.status(400).json({
          message: "userId and role are required",
        });
      }

      if (!Object.values(ProjectRole).includes(role)) {
        return res.status(400).json({
          message: "Invalid role",
          allowedRoles: Object.values(ProjectRole),
        });
      }

      await projectService.addMember(id, requesterId, {
        userId: memberUserId,
        role,
        addedBy: requesterId,
      });

      return res.status(201).json({
        message: "Member added successfully",
      });
    } catch (error: any) {
      console.error("Add member error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      if (error instanceof DuplicateProjectMemberError) {
        return res.status(409).json({ message: error.message });
      }

      if (error instanceof ArchivedProjectError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * DELETE /api/projects/:id/members/:userId - Remove member from project
   */
  static async removeMember(req: Request, res: Response) {
    try {
      const { id, userId: memberUserId } = req.params;
      const requesterId = req.user?.id;

      if (!requesterId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await projectService.removeMember(id, requesterId, memberUserId);

      return res.status(200).json({
        message: "Member removed successfully",
      });
    } catch (error: any) {
      console.error("Remove member error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      if (error instanceof ProjectValidationError) {
        return res.status(400).json({ message: error.message });
      }

      if (error instanceof ArchivedProjectError) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * POST /api/projects/:id/archive - Archive project
   */
  static async archiveProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await projectService.archiveProject(id, userId);

      return res.status(200).json({
        message: "Project archived successfully",
      });
    } catch (error: any) {
      console.error("Archive project error:", error);

      if (error instanceof ProjectNotFoundError) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof UnauthorizedProjectAccessError) {
        return res.status(403).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  /**
   * POST /api/projects/:id/progress - Update project progress
   */
  static async updateProgress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      await projectService.updateProjectProgress(id);

      return res.status(200).json({
        message: "Project progress updated successfully",
      });
    } catch (error: any) {
      console.error("Update progress error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}
