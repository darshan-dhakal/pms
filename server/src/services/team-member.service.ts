import { AppDataSource } from "../config/datasource";
import { TeamMember } from "../entities/team-member.entity";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";
import { AddTeamMemberDto, UpdateTeamMemberDto } from "../dto/team-member.dto";
import { TeamRole } from "../constant/enums";

const teamMemberRepository = AppDataSource.getRepository(TeamMember);
const userRepository = AppDataSource.getRepository(User);
const teamRepository = AppDataSource.getRepository(Team);

export class TeamMemberService {
  static async addMemberToTeam(data: AddTeamMemberDto) {
    const user = await userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const team = await teamRepository.findOne({
      where: { id: data.teamId },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    // Check if user is already a member
    const existingMember = await teamMemberRepository.findOne({
      where: { user: { id: data.userId }, team: { id: data.teamId } },
    });

    if (existingMember) {
      throw new Error("User is already a member of this team");
    }

    const member = teamMemberRepository.create({
      user,
      team,
      role: data.role || TeamRole.MEMBER,
    });

    return await teamMemberRepository.save(member);
  }

  static async removeMemberFromTeam(userId: string, teamId: string) {
    const member = await teamMemberRepository.findOne({
      where: { user: { id: userId }, team: { id: teamId } },
    });

    if (!member) {
      throw new Error("Team member not found");
    }

    return await teamMemberRepository.remove(member);
  }

  static async getTeamMembers(teamId: string) {
    return await teamMemberRepository.find({
      where: { team: { id: teamId } },
      relations: ["user", "team"],
    });
  }

  static async getUserTeams(userId: string) {
    return await teamMemberRepository.find({
      where: { user: { id: userId } },
      relations: ["user", "team"],
    });
  }

  static async updateMemberRole(
    userId: string,
    teamId: string,
    data: UpdateTeamMemberDto
  ) {
    const member = await teamMemberRepository.findOne({
      where: { user: { id: userId }, team: { id: teamId } },
    });

    if (!member) {
      throw new Error("Team member not found");
    }

    member.role = data.role;
    return await teamMemberRepository.save(member);
  }
}
