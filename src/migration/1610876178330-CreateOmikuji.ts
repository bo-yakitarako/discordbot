import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOmikuji1610876178330 implements MigrationInterface {
    name = 'CreateOmikuji1610876178330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "omikuji" ("id" SERIAL NOT NULL, "userId" character varying(64) NOT NULL, "yoshida" integer NOT NULL DEFAULT '0', "daikichi" integer NOT NULL DEFAULT '0', "chukichi" integer NOT NULL DEFAULT '0', "kichi" integer NOT NULL DEFAULT '0', "syokichi" integer NOT NULL DEFAULT '0', "suekichi" integer NOT NULL DEFAULT '0', "kyo" integer NOT NULL DEFAULT '0', "daikyo" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bad713423f1c2e0b773da301d50" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "omikuji"`);
    }

}
