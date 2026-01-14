import { TeamRole } from "../constant/enums";

export class AddTeamMemberDto {
  userId: string;
  teamId: string;
  role?: TeamRole;
}

export class UpdateTeamMemberDto {
  role: TeamRole;
}
