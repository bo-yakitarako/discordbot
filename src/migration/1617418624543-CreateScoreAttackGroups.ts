import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateScoreAttackGroups1617418624543 implements MigrationInterface {
    name = 'CreateScoreAttackGroups1617418624543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "score_attack_groups" ("groupId" SERIAL NOT NULL, "groupName" character varying(256) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fc41cc18877cbca9d54c38f6405" PRIMARY KEY ("groupId"))`);
        await queryRunner.query(`ALTER TABLE "score_attack_users" ADD "groupId" integer DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_histories"."artistWebsite" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_histories" ALTER COLUMN "artistWebsite" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_histories"."mapperDisplayName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_histories" ALTER COLUMN "mapperDisplayName" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."artistWebsite" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_songs" ALTER COLUMN "artistWebsite" SET DEFAULT null`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."mapperDisplayName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_songs" ALTER COLUMN "mapperDisplayName" SET DEFAULT null`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "score_attack_songs" ALTER COLUMN "mapperDisplayName" SET DEFAULT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."mapperDisplayName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_songs" ALTER COLUMN "artistWebsite" SET DEFAULT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."artistWebsite" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_histories" ALTER COLUMN "mapperDisplayName" SET DEFAULT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_histories"."mapperDisplayName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_histories" ALTER COLUMN "artistWebsite" SET DEFAULT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "score_attack_histories"."artistWebsite" IS NULL`);
        await queryRunner.query(`ALTER TABLE "score_attack_users" DROP COLUMN "groupId"`);
        await queryRunner.query(`DROP TABLE "score_attack_groups"`);
    }

}
