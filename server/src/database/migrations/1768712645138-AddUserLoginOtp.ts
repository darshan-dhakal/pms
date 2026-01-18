import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLoginOtp1768712645138 implements MigrationInterface {
    name = 'AddUserLoginOtp1768712645138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "loginOtp" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "loginOtpExpiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "loginOtpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "loginOtp"`);
    }

}
