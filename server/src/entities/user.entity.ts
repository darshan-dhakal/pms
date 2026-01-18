// import { Column, Entity, OneToMany } from "typeorm";
// import { Exclude } from "class-transformer";
// import BaseEntity from "./base.entity";
// import { TeamMember } from "./team-member.entity";

// @Entity("users")
// export class User extends BaseEntity {
//   @Column()
//   firstName: string;

//   @Column()
//   lastName: string;

//   @Column({ unique: true })
//   email: string;

//   @Exclude()
//   @Column({ select: false })
//   password: string;

//   @Column({ default: false })
//   isEmailVerified: boolean;

//   @Column({ default: true })
//   isActive: boolean;

//   @Exclude()
//   @Column({ select: false, nullable: true })
//   emailVerificationToken: string | null;

//   @Exclude()
//   @Column({ select: false, nullable: true })
//   emailVerificationTokenExpiresAt: Date | null;

//   @Exclude()
//   @Column({ select: false, nullable: true })
//   resetPasswordToken: string | null;

//   @Exclude()
//   @Column({ select: false, nullable: true })
//   resetPasswordTokenExpiresAt: Date | null;

//   @OneToMany(() => TeamMember, (tm) => tm.user)
//   teams: TeamMember[];
// }
import { Column, Entity, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import BaseEntity from "./base.entity";
import { TeamMember } from "./team-member.entity";
import { UserRole } from "../constant/enums";

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Exclude()
  @Column({ type: "varchar", select: false })
  password: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: "boolean", default: false })
  isEmailVerified: boolean;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: "varchar", select: false, nullable: true })
  loginOtp: string | null;

  @Exclude()
  @Column({ type: "timestamp", nullable: true, select: false })
  loginOtpExpiresAt: Date | null;

  @Exclude()
  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  emailVerificationToken: string | null;

  @Exclude()
  @Column({
    type: "timestamp",
    nullable: true,
    select: false,
  })
  emailVerificationTokenExpiresAt: Date | null;

  @Exclude()
  @Column({
    type: "varchar",
    nullable: true,
    select: false,
  })
  resetPasswordToken: string | null;

  @Exclude()
  @Column({
    type: "timestamp",
    nullable: true,
    select: false,
  })
  resetPasswordTokenExpiresAt: Date | null;

  @OneToMany(() => TeamMember, (tm) => tm.user)
  teams: TeamMember[];
}
