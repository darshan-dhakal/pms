import api from "../axios-config";

export interface Project {
  id: number;
  name: string;
  description: string;
  status?: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
  // startDate?: string;
  // endDate?: string;
  createdAt: string;
  updatedAt: string;
  members?: number;
}

export interface CreateProjectData {
  name: string;
  description: string;
}

export const projectApi = {
  // Get all projects
  getAllProjects: async () => {
    const response = await api.get<{ projects: Project[]; total: number }>(
      "/projects",
    );
    return response.data.projects;
  },

  // Get single project
  getProject: async (id: number) => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (data: CreateProjectData) => {
    const response = await api.post<Project>("/projects", data);
    return response.data;
  },

  // Update project
  updateProject: async (id: number, data: Partial<CreateProjectData>) => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: number) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};
