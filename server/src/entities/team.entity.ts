import { Column, Entity, OneToMany } from "typeorm";
import BaseEntity from "./base.entity";
import { TeamMember } from "./team-member.entity";
import { Project } from "./project.entity";

@Entity("teams")
export class Team extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => TeamMember, (tm) => tm.team)
  members: TeamMember[];

  @OneToMany(() => Project, (project) => project.team)
  projects: Project[];
}
