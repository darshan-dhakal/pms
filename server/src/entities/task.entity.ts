import { Column, Entity, ManyToOne, Index } from "typeorm";
import BaseEntity from "./base.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";
import { TaskStatus } from "../constant/enums";
import { TaskPriority } from "../constant/enums";

@Entity("tasks")
@Index(["project", "status"])
@Index(["assignedTo"])
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ default: 0 })
  estimatedHours: number;

  @Column({ default: 0 })
  actualHours: number;

  @Column({ default: false })
  isCompleted: boolean; // Required for project completion

  // Relations
  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
  })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User;

  @Column({ nullable: true })
  reporterId: string; // User who created the task
}
