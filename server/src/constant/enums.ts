export enum Environment {
  DEVELOPMENT = "DEVELOPMENT",
  PRODUCTION = "PRODUCTION",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  TEAM_LEAD = "TEAM_LEAD",
  USER = "USER",
}

export enum TeamRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum Permissions {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  VIEW_ANALYTICS = "VIEW_ANALYTICS",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum DevicePlatform {
  ANDROID = "Android",
  IOS = "iOS",
  WEB = "Web",
}
