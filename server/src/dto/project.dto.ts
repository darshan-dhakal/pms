export class CreateProjectDto {
  name: string;
  description?: string;
  teamId: string;
}

export class UpdateProjectDto {
  name?: string;
  description?: string;
}
