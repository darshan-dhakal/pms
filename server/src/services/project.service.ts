import { AppDataSource } from "../config/datasource";
import { Project } from "../entities/project.entity";
import { Team } from "../entities/team.entity";
import { CreateProjectDto, UpdateProjectDto } from "../dto/project.dto";

const projectRepository = AppDataSource.getRepository(Project);
const teamRepository = AppDataSource.getRepository(Team);

export class ProjectService {
  static async createProject(data: CreateProjectDto) {
    const team = await teamRepository.findOne({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    const project = projectRepository.create({
      name: data.name,
      description: data.description,
      team,
    });

    return await projectRepository.save(project);
  }

  static async getProjectById(id: string) {
    const project = await projectRepository.findOne({
      where: { id },
      relations: ["team", "tasks"],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }

  static async getProjectsByTeam(teamId: string) {
    return await projectRepository.find({
      where: { team: { id: teamId } },
      relations: ["team", "tasks"],
    });
  }

  static async updateProject(id: string, data: UpdateProjectDto) {
    const project = await projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (data.name) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;

    return await projectRepository.save(project);
  }

  static async deleteProject(id: string) {
    const project = await projectRepository.findOne({
      where: { id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return await projectRepository.remove(project);
  }

  static async getAllProjects() {
    return await projectRepository.find({
      relations: ["team", "tasks"],
    });
  }
}
