import { Column, Entity, ManyToOne, Index, Unique } from "typeorm";
import BaseEntity from "./base.entity";
import { Project } from "./project.entity";

export enum ProjectRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
  VIEWER = "VIEWER",
}

@Entity("project_members")
@Unique(["project", "userId"])
@Index(["project", "role"])
export class ProjectMember extends BaseEntity {
  @Column()
  userId: string;

  @Column({
    type: "enum",
    enum: ProjectRole,
    default: ProjectRole.MEMBER,
  })
  role: ProjectRole;

  @Column()
  addedBy: string; // User ID who added this member

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: "CASCADE",
  })
  project: Project;
}
