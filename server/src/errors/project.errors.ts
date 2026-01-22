export class ProjectNotFoundError extends Error {
  constructor(projectId: string) {
    super(`Project with ID ${projectId} not found`);
    this.name = "ProjectNotFoundError";
  }
}

export class UnauthorizedProjectAccessError extends Error {
  constructor(action: string) {
    super(`Unauthorized to ${action} this project`);
    this.name = "UnauthorizedProjectAccessError";
  }
}

export class InvalidStatusTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Cannot transition project from ${from} to ${to}`);
    this.name = "InvalidStatusTransitionError";
  }
}

export class DuplicateProjectMemberError extends Error {
  constructor(userId: string) {
    super(`User ${userId} is already a member of this project`);
    this.name = "DuplicateProjectMemberError";
  }
}

export class ProjectValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectValidationError";
  }
}

export class ArchivedProjectError extends Error {
  constructor() {
    super("Cannot modify an archived project");
    this.name = "ArchivedProjectError";
  }
}
