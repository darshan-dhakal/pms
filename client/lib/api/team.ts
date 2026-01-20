import api from "../axios-config";

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  members?: unknown[];
  projects?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string | null;
}

export const teamApi = {
  // Get all teams
  getAllTeams: async () => {
    const response = await api.get<{ teams: Team[]; total: number }>("/teams");
    return response.data.teams;
  },

  // Get single team
  getTeam: async (id: string) => {
    const response = await api.get<{ team: Team }>(`/teams/${id}`);
    return response.data.team;
  },

  // Create new team
  createTeam: async (data: CreateTeamData) => {
    const response = await api.post<{ message: string; team: Team }>(
      "/teams",
      data,
    );
    return response.data.team;
  },

  // Update team
  updateTeam: async (id: string, data: UpdateTeamData) => {
    const response = await api.patch<{ message: string; team: Team }>(
      `/teams/${id}`,
      data,
    );
    return response.data.team;
  },

  // Delete team
  deleteTeam: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/teams/${id}`);
    return response.data.message;
  },
};
