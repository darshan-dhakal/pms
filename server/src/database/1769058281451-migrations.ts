import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1769058281451 implements MigrationInterface {
    name = 'Migrations1769058281451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_members_role_enum" AS ENUM('OWNER', 'MANAGER', 'MEMBER', 'VIEWER')`);
        await queryRunner.query(`CREATE TABLE "project_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "role" "public"."project_members_role_enum" NOT NULL DEFAULT 'MEMBER', "addedBy" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "projectId" uuid, CONSTRAINT "UQ_326b2a901eb18ac24eabc9b0581" UNIQUE ("projectId", "userId"), CONSTRAINT "PK_0b2f46f804be4aea9234c78bcc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d29930283c94252ce001ff2f8" ON "project_members" ("projectId", "role") `);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'BACKLOG'`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "dueDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "estimatedHours" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "actualHours" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "reporterId" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('DRAFT', 'PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "status" "public"."projects_status_enum" NOT NULL DEFAULT 'DRAFT'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "organizationId" character varying NOT NULL DEFAULT 'default-org'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "ownerId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "endDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "progress" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "totalTasks" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "completedTasks" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "isArchived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_d020677feafe94eba0cb9d846d" ON "tasks" ("assignedToId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7d41cf142c3c968c6a2d94abbb" ON "tasks" ("projectId", "status") `);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_d19892d8f03928e5bfc7313780c" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_d19892d8f03928e5bfc7313780c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7d41cf142c3c968c6a2d94abbb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d020677feafe94eba0cb9d846d"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "completedTasks"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "totalTasks"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "progress"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "reporterId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "actualHours"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "estimatedHours"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "dueDate"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d29930283c94252ce001ff2f8"`);
        await queryRunner.query(`DROP TABLE "project_members"`);
        await queryRunner.query(`DROP TYPE "public"."project_members_role_enum"`);
    }

}
