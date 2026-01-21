import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { Team } from "../entities/team.entity";
import { TeamMember } from "../entities/team-member.entity";
import { Project } from "../entities/project.entity";
import { Task } from "../entities/task.entity";
import { ProjectMember } from "../entities/project-member.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false, // ALWAYS false in production
  logging: false,

  entities: [User, Team, TeamMember, Project, Task, ProjectMember],

  migrations: ["src/database/migrations/*.ts"],
});
