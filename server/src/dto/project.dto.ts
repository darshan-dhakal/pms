// export class CreateProjectDto {
//   name: string;
//   description?: string;
//   teamId: string;
// }

// export class UpdateProjectDto {
//   name?: string;
//   description?: string;
// }
import { ProjectRole } from "../entities/project-member.entity";
export class CreateProjectDto {
  name: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  startDate?: Date;
  endDate?: Date;
}

export class UpdateProjectDto {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export class AddMemberDto {
  userId: string;
  role: ProjectRole;
  addedBy: string;
}
