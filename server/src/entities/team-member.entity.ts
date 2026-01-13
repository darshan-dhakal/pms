import { Column, Entity, ManyToOne, Unique } from "typeorm";
import BaseEntity from "./base.entity";
import { User } from "./user.entity";
import { Team } from "./team.entity";
import { TeamRole } from "../constant/enums";

@Entity("team_members")
@Unique(["user", "team"])
export class TeamMember extends BaseEntity {
  @ManyToOne(() => User, (user) => user.teams, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: "CASCADE",
  })
  team: Team;

  @Column({
    type: "enum",
    enum: TeamRole,
    default: TeamRole.MEMBER,
  })
  role: TeamRole;
}
