import { MigrationInterface, QueryRunner } from "typeorm";

export class InitHRMSModules1768828530944 implements MigrationInterface {
    name = 'InitHRMSModules1768828530944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "username" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "is_login" boolean NOT NULL DEFAULT false, "role" character varying(20) NOT NULL, "token" character varying(255), "company" character varying, "department" character varying, "status" character varying NOT NULL DEFAULT 'active', "last_login" TIMESTAMP, "access_count" integer NOT NULL DEFAULT 0, "observation_area" character varying(1000), "email" character varying, "name" character varying, "position" character varying, "sub" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "type" character varying(20) NOT NULL, "status" character varying(30) NOT NULL, "file_path" character varying(500) NOT NULL, "file_size" integer, "version" integer NOT NULL DEFAULT 1, "generated_from_profile_version" integer, "description" text, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "date" date, "type" character varying(30) NOT NULL, "issuer" character varying(255), CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "full_name" character varying(255) NOT NULL, "national_id" character varying(50), "date_of_birth" date, "gender" character varying(20), "department" character varying(255), "position" character varying(255), "work_email" character varying(255), "date_of_joining" date, "avatar_url" character varying(500), "phone_number" character varying(50), "address" character varying(500), CONSTRAINT "UQ_78f6f7f72b0f667507acbf14d6d" UNIQUE ("national_id"), CONSTRAINT "REL_6ca9503d77ae39b4b5a6cc3ba8" UNIQUE ("user_id"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "category" character varying(100), CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "created_by" character varying, "updated_by" character varying, "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, "degree" character varying(255) NOT NULL, "institution" character varying(255) NOT NULL, "start_year" integer, "end_year" integer, "description" text, "field_of_study" character varying(255), CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("skill_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_816eba68a0ca1b837ec15daefc7" PRIMARY KEY ("skill_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb69710b0a00f42fb95fc2ac2f" ON "user_skills" ("skill_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6926002c360291df66bb2c5fde" ON "user_skills" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD CONSTRAINT "FK_0c0cd24bc6e722c12cd45750434" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "educations" ADD CONSTRAINT "FK_ed30b84b392640d53591405a1f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5"`);
        await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_ed30b84b392640d53591405a1f7"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_0c0cd24bc6e722c12cd45750434"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6926002c360291df66bb2c5fde"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb69710b0a00f42fb95fc2ac2f"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "educations"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
