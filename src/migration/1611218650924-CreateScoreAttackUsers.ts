import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateScoreAttackUsers1611218650924 implements MigrationInterface {
    name = 'CreateScoreAttackUsers1611218650924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "score_attack_users" ("id" SERIAL NOT NULL, "discordId" character varying(64) NOT NULL, "sparebeatName" character varying(64) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2aeb144a9e0688c5a2a8109d8cd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "score_attack_users"`);
    }

}
