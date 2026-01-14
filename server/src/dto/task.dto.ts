export class CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  assignedToId?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  assignedToId?: string;
}
