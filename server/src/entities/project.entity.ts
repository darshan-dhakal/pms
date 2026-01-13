import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import BaseEntity from "./base.entity";
import { Team } from "./team.entity";
import { Task } from "./task.entity";

@Entity("projects")
export class Project extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Team, (team) => team.projects, {
    onDelete: "CASCADE",
  })
  team: Team;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
