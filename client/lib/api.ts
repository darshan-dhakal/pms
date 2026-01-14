const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
      throw new Error(data.message || "API request failed");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const authApi = {
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) =>
    apiCall("/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    }),

  verifyEmail: (token: string) =>
    apiCall("/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerificationEmail: (email: string) =>
    apiCall("/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (email: string, password: string) =>
    apiCall("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  adminLogin: (email: string, password: string) =>
    apiCall("/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  forgotPassword: (email: string) =>
    apiCall("/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiCall("/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};

export const userApi = {
  getProfile: () =>
    apiCall("/users/profile", {
      method: "GET",
    }),

  deleteOwnAccount: () =>
    apiCall("/users/me", {
      method: "DELETE",
    }),

  getAllUsers: () =>
    apiCall("/users", {
      method: "GET",
    }),

  getUserById: (id: string) =>
    apiCall(`/users/${id}`, {
      method: "GET",
    }),

  updateUserRole: (id: string, role: string) =>
    apiCall(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  toggleUserStatus: (id: string) =>
    apiCall(`/users/${id}/toggle-status`, {
      method: "PATCH",
    }),

  deleteUserById: (id: string) =>
    apiCall(`/users/${id}`, {
      method: "DELETE",
    }),
};

export const projectApi = {
  create: (data: Record<string, any>) =>
    apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiCall("/projects", {
      method: "GET",
    }),

  getProjectsByTeam: (teamId: string) =>
    apiCall(`/projects/team/${teamId}`, {
      method: "GET",
    }),

  getById: (id: string) =>
    apiCall(`/projects/${id}`, {
      method: "GET",
    }),

  update: (id: string, data: Record<string, any>) =>
    apiCall(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/projects/${id}`, {
      method: "DELETE",
    }),
};

export const taskApi = {
  create: (data: Record<string, any>) =>
    apiCall("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiCall("/tasks", {
      method: "GET",
    }),

  getTasksByProject: (projectId: string) =>
    apiCall(`/tasks/project/${projectId}`, {
      method: "GET",
    }),

  getById: (id: string) =>
    apiCall(`/tasks/${id}`, {
      method: "GET",
    }),

  update: (id: string, data: Record<string, any>) =>
    apiCall(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/tasks/${id}`, {
      method: "DELETE",
    }),
};

export const teamApi = {
  create: (data: Record<string, any>) =>
    apiCall("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiCall("/teams", {
      method: "GET",
    }),

  getById: (id: string) =>
    apiCall(`/teams/${id}`, {
      method: "GET",
    }),

  update: (id: string, data: Record<string, any>) =>
    apiCall(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall(`/teams/${id}`, {
      method: "DELETE",
    }),
};

export const teamMemberApi = {
  addMember: (data: Record<string, any>) =>
    apiCall("/team-members", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTeamMembers: (teamId: string) =>
    apiCall(`/team-members/team/${teamId}`, {
      method: "GET",
    }),

  getUserTeams: (userId: string) =>
    apiCall(`/team-members/user/${userId}`, {
      method: "GET",
    }),

  updateMemberRole: (userId: string, teamId: string, role: string) =>
    apiCall(`/team-members/${userId}/${teamId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),

  removeMember: (userId: string, teamId: string) =>
    apiCall(`/team-members/${userId}/${teamId}`, {
      method: "DELETE",
    }),
};

export default apiCall;
