import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import BaseEntity from "./base.entity";
import { ProjectMember } from "./project-member.entity";
import { Task } from "./task.entity";
import { Team } from "./team.entity";
import { ProjectStatus } from "../constant/enums";

@Entity("projects")
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  status: ProjectStatus;

  @Column({ default: "default-org" })
  organizationId: string;

  @Column()
  ownerId: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0 })
  progress: number; // 0-100%

  @Column({ default: 0 })
  totalTasks: number;

  @Column({ default: 0 })
  completedTasks: number;

  @Column({ default: false })
  isArchived: boolean;

  // Relations
  @OneToMany(() => ProjectMember, (member) => member.project, {
    cascade: true,
    eager: false,
  })
  members: ProjectMember[];

  @ManyToOne(() => Team, (team) => team.projects, {
    onDelete: "CASCADE",
  })
  team: Team;

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
    eager: false,
  })
  tasks: Task[];

  // Helper method to compute progress
  computeProgress(): void {
    if (this.totalTasks === 0) {
      this.progress = 0;
    } else {
      this.progress = Math.round((this.completedTasks / this.totalTasks) * 100);
    }
  }
}
