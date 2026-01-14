import { AppDataSource } from "../config/datasource";
import { Team } from "../entities/team.entity";
import { CreateTeamDto, UpdateTeamDto } from "../dto/team.dto";

const teamRepository = AppDataSource.getRepository(Team);

export class TeamService {
  static async createTeam(data: CreateTeamDto) {
    const team = teamRepository.create({
      name: data.name,
      description: data.description,
    });

    return await teamRepository.save(team);
  }

  static async getTeamById(id: string) {
    const team = await teamRepository.findOne({
      where: { id },
      relations: ["members", "projects"],
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  }

  static async getAllTeams() {
    return await teamRepository.find({
      relations: ["members", "projects"],
    });
  }

  static async updateTeam(id: string, data: UpdateTeamDto) {
    const team = await teamRepository.findOne({
      where: { id },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    if (data.name) team.name = data.name;
    if (data.description !== undefined) team.description = data.description;

    return await teamRepository.save(team);
  }

  static async deleteTeam(id: string) {
    const team = await teamRepository.findOne({
      where: { id },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return await teamRepository.remove(team);
  }
}
