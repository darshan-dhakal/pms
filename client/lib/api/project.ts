import api from "../axios-config";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "DRAFT" | "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
  ownerId: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  members?: any[];
  tasks?: any[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  role: "OWNER" | "MANAGER" | "MEMBER" | "VIEWER";
  joinedAt: string;
}

export const projectApi = {
  // Get all projects for user
  getAllProjects: async () => {
    const response = await api.get<{ projects: Project[]; total: number }>(
      "/projects",
    );
    return response.data.projects;
  },

  // Get single project
  getProject: async (id: string) => {
    const response = await api.get<{ project: Project }>(`/projects/${id}`);
    return response.data.project;
  },

  // Create new project
  createProject: async (data: CreateProjectData) => {
    const response = await api.post<{ message: string; project: Project }>(
      "/projects",
      data,
    );
    return response.data.project;
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectData) => {
    const response = await api.patch<{ message: string; project: Project }>(
      `/projects/${id}`,
      data,
    );
    return response.data.project;
  },

  // Change project status
  changeProjectStatus: async (id: string, status: Project["status"]) => {
    const response = await api.patch<{ message: string; project: Project }>(
      `/projects/${id}/status`,
      { status },
    );
    return response.data.project;
  },

  // Add member to project
  addMember: async (
    projectId: string,
    userId: string,
    role: ProjectMember["role"],
  ) => {
    const response = await api.post(`/projects/${projectId}/members`, {
      userId,
      role,
    });
    return response.data;
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string) => {
    const response = await api.delete(
      `/projects/${projectId}/members/${userId}`,
    );
    return response.data;
  },

  // Archive project
  archiveProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/archive`);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
