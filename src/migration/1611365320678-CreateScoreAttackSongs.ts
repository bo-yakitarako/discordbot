import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScoreAttackSongs1611365320678 implements MigrationInterface {
  name = 'CreateScoreAttackSongs1611365320678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "score_attack_songs" ("songsId" SERIAL NOT NULL, "guildId" character varying(64) NOT NULL, "title" character varying(256) NOT NULL, "url" character varying(256) NOT NULL, "artist" character varying(128) NOT NULL DEFAULT '', "artistWebsite" character varying(256) DEFAULT null, "hash" character varying(32) NOT NULL, "mapperName" character varying(32) NOT NULL, "mapperDisplayName" character varying(256) DEFAULT null, "difficulty" integer NOT NULL, "level" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_37d14a7826f510a9080784ca8da" PRIMARY KEY ("songsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e69386571734f64f19caa82982" ON "score_attack_songs" ("guildId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_e69386571734f64f19caa82982"`);
    await queryRunner.query(`DROP TABLE "score_attack_songs"`);
  }
}
