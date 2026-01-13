import { Column, Entity, ManyToOne } from "typeorm";
import BaseEntity from "./base.entity";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity("tasks")
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: "CASCADE",
  })
  project: Project;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User;
}
