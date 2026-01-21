// import { AppDataSource } from "../config/datasource";
// import { Project } from "../entities/project.entity";
// import { Team } from "../entities/team.entity";
// import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

// const projectRepository = AppDataSource.getRepository(Project);
// const teamRepository = AppDataSource.getRepository(Team);

// export class ProjectService {
//   static async createProject(data: CreateProjectDto) {
//     const team = await teamRepository.findOne({
//       where: { id: data.teamId },
//     });

//     if (!team) {
//       throw new Error("Team not found");
//     }

//     const project = projectRepository.create({
//       name: data.name,
//       description: data.description,
//       team,
//     });

//     return await projectRepository.save(project);
//   }

//   static async getProjectById(id: string) {
//     const project = await projectRepository.findOne({
//       where: { id },
//       relations: ["team", "tasks"],
//     });

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     return project;
//   }

//   static async getProjectsByTeam(teamId: string) {
//     return await projectRepository.find({
//       where: { team: { id: teamId } },
//       relations: ["team", "tasks"],
//     });
//   }

//   static async updateProject(id: string, data: UpdateProjectDto) {
//     const project = await projectRepository.findOne({
//       where: { id },
//     });

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     if (data.name) project.name = data.name;
//     if (data.description !== undefined) project.description = data.description;

//     return await projectRepository.save(project);
//   }

//   static async deleteProject(id: string) {
//     const project = await projectRepository.findOne({
//       where: { id },
//     });

//     if (!project) {
//       throw new Error("Project not found");
//     }

//     return await projectRepository.remove(project);
//   }

//   static async getAllProjects() {
//     return await projectRepository.find({
//       relations: ["team", "tasks"],
//     });
//   }
// }
import { ProjectRepository } from "../repositories/project.repository";
import { Project } from "../entities/project.entity";
import { ProjectRole } from "../entities/project-member.entity";
import {
  ProjectNotFoundError,
  UnauthorizedProjectAccessError,
  InvalidStatusTransitionError,
  DuplicateProjectMemberError,
  ProjectValidationError,
  ArchivedProjectError,
} from "../errors/project.errors";
import { ProjectStatus, ActivityType } from "../constant/enums";
import { ActivityLogService } from "./activity-log.service";
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddMemberDto,
} from "../dto/project.dto";

// Allowed status transitions
const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  [ProjectStatus.DRAFT]: [ProjectStatus.PLANNED, ProjectStatus.ARCHIVED],
  [ProjectStatus.PLANNED]: [
    ProjectStatus.ACTIVE,
    ProjectStatus.DRAFT,
    ProjectStatus.ARCHIVED,
  ],
  [ProjectStatus.ACTIVE]: [
    ProjectStatus.ON_HOLD,
    ProjectStatus.COMPLETED,
    ProjectStatus.ARCHIVED,
  ],
  [ProjectStatus.ON_HOLD]: [ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED],
  [ProjectStatus.COMPLETED]: [ProjectStatus.ARCHIVED],
  [ProjectStatus.ARCHIVED]: [],
};

// Permission matrix
const ROLE_PERMISSIONS: Record<ProjectRole, string[]> = {
  [ProjectRole.OWNER]: [
    "update",
    "delete",
    "changeStatus",
    "addMember",
    "removeMember",
    "archive",
  ],
  [ProjectRole.MANAGER]: ["update", "changeStatus", "addMember"],
  [ProjectRole.MEMBER]: ["update"],
  [ProjectRole.VIEWER]: [],
};

export class ProjectService {
  private repository: ProjectRepository;
  private activityLog: ActivityLogService;

  constructor() {
    this.repository = new ProjectRepository();
    this.activityLog = new ActivityLogService();
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectDto): Promise<Project> {
    // Validation
    this.validateProjectDates(data.startDate, data.endDate);

    // Create project
    const project = await this.repository.create({
      ...data,
      status: ProjectStatus.DRAFT,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      isArchived: false,
    });

    // Auto-add owner as member
    await this.repository.addMember({
      project: project,
      userId: data.ownerId,
      role: ProjectRole.OWNER,
      addedBy: data.ownerId,
      isActive: true,
    });

    // Log activity
    await this.activityLog.log({
      projectId: project.id,
      activityType: ActivityType.PROJECT_CREATED,
      actorId: data.ownerId,
      entityType: "project",
      entityId: project.id,
      description: `Project "${project.name}" created`,
    });

    return project;
  }

  /**
   * Update project details
   */
  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check if archived
    if (project.isArchived) {
      throw new ArchivedProjectError();
    }

    // Check permissions
    await this.checkPermission(projectId, userId, "update");

    // Validate dates
    this.validateProjectDates(data.startDate, data.endDate);

    // Track changes for audit
    const changes: Record<string, any> = {};
    if (data.name && data.name !== project.name) {
      changes.name = { from: project.name, to: data.name };
    }
    if (data.description !== undefined) {
      changes.description = { from: project.description, to: data.description };
    }

    // Update
    const updated = await this.repository.update(projectId, data);

    // Log activity
    if (Object.keys(changes).length > 0) {
      await this.activityLog.log({
        projectId,
        activityType: ActivityType.PROJECT_UPDATED,
        actorId: userId,
        entityType: "project",
        entityId: projectId,
        changes,
      });
    }

    return updated;
  }

  /**
   * Change project status with validation
   */
  async changeProjectStatus(
    projectId: string,
    userId: string,
    newStatus: ProjectStatus,
  ): Promise<Project> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check if archived
    if (project.isArchived) {
      throw new ArchivedProjectError();
    }

    // Check permissions
    await this.checkPermission(projectId, userId, "changeStatus");

    // Validate transition
    const allowedTransitions = ALLOWED_TRANSITIONS[project.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new InvalidStatusTransitionError(project.status, newStatus);
    }

    // Additional validation for COMPLETED status
    if (newStatus === ProjectStatus.COMPLETED) {
      await this.validateCompletion(project);
    }

    const oldStatus = project.status;

    // Update status
    const updated = await this.repository.update(projectId, {
      status: newStatus,
    });

    // Log activity
    await this.activityLog.log({
      projectId,
      activityType: ActivityType.PROJECT_STATUS_CHANGED,
      actorId: userId,
      entityType: "project",
      entityId: projectId,
      changes: {
        status: { from: oldStatus, to: newStatus },
      },
      description: `Status changed from ${oldStatus} to ${newStatus}`,
    });

    return updated;
  }

  /**
   * Add member to project
   */
  async addMember(
    projectId: string,
    requesterId: string,
    data: AddMemberDto,
  ): Promise<void> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check if archived
    if (project.isArchived) {
      throw new ArchivedProjectError();
    }

    // Check permissions
    await this.checkPermission(projectId, requesterId, "addMember");

    // Check if already a member
    const exists = await this.repository.isMemberExists(projectId, data.userId);
    if (exists) {
      throw new DuplicateProjectMemberError(data.userId);
    }

    // Add member
    await this.repository.addMember({
      project: project,
      userId: data.userId,
      role: data.role,
      addedBy: requesterId,
      isActive: true,
    });

    // Log activity
    await this.activityLog.log({
      projectId,
      activityType: ActivityType.MEMBER_ADDED,
      actorId: requesterId,
      entityType: "project_member",
      entityId: data.userId,
      description: `User ${data.userId} added as ${data.role}`,
    });
  }

  /**
   * Remove member from project
   */
  async removeMember(
    projectId: string,
    requesterId: string,
    userIdToRemove: string,
  ): Promise<void> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check if archived
    if (project.isArchived) {
      throw new ArchivedProjectError();
    }

    // Check permissions
    await this.checkPermission(projectId, requesterId, "removeMember");

    // Cannot remove owner
    if (project.ownerId === userIdToRemove) {
      throw new ProjectValidationError("Cannot remove project owner");
    }

    // Remove member
    await this.repository.removeMember(projectId, userIdToRemove);

    // TODO: Reassign tasks if member had assigned tasks

    // Log activity
    await this.activityLog.log({
      projectId,
      activityType: ActivityType.MEMBER_REMOVED,
      actorId: requesterId,
      entityType: "project_member",
      entityId: userIdToRemove,
      description: `User ${userIdToRemove} removed from project`,
    });
  }

  /**
   * Archive project (soft delete)
   */
  async archiveProject(projectId: string, userId: string): Promise<void> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check permissions (only owner can archive)
    const role = await this.repository.getMemberRole(projectId, userId);
    if (role !== ProjectRole.OWNER) {
      throw new UnauthorizedProjectAccessError("archive");
    }

    // Update status and archive flag
    await this.repository.update(projectId, {
      status: ProjectStatus.ARCHIVED,
      isArchived: true,
    });

    // Log activity
    await this.activityLog.log({
      projectId,
      activityType: ActivityType.PROJECT_ARCHIVED,
      actorId: userId,
      entityType: "project",
      entityId: projectId,
      description: `Project archived`,
    });
  }

  /**
   * Get project by ID (with permission check)
   */
  async getProjectById(projectId: string, userId: string): Promise<Project> {
    const project = await this.repository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // Check if user is a member
    const isMember = await this.repository.isMemberExists(projectId, userId);
    if (!isMember && project.ownerId !== userId) {
      throw new UnauthorizedProjectAccessError("view");
    }

    return project;
  }

  /**
   * Get all projects for an organization
   */
  async getOrganizationProjects(
    organizationId: string,
    userId: string,
  ): Promise<Project[]> {
    // TODO: Filter by user membership
    return this.repository.findByOrganization(organizationId, false);
  }

  /**
   * Recompute project progress based on tasks
   */
  async updateProjectProgress(projectId: string): Promise<void> {
    await this.repository.updateProgress(projectId);
  }

  // ============ PRIVATE HELPERS ============

  private async checkPermission(
    projectId: string,
    userId: string,
    action: string,
  ): Promise<void> {
    const role = await this.repository.getMemberRole(projectId, userId);

    if (!role) {
      throw new UnauthorizedProjectAccessError(action);
    }

    const allowedActions = ROLE_PERMISSIONS[role as ProjectRole] || [];
    if (!allowedActions.includes(action)) {
      throw new UnauthorizedProjectAccessError(action);
    }
  }

  private validateProjectDates(startDate?: Date, endDate?: Date): void {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new ProjectValidationError("Start date cannot be after end date");
    }
  }

  private async validateCompletion(project: Project): Promise<void> {
    // Ensure all mandatory tasks are completed
    const mandatoryTasks = project.tasks?.filter((t) => t.isCompleted) || [];
    const incompleteTasks = mandatoryTasks.filter((t) => t.status !== "DONE");

    if (incompleteTasks.length > 0) {
      throw new ProjectValidationError(
        `Cannot complete project. ${incompleteTasks.length} mandatory tasks are incomplete.`,
      );
    }
  }
}
