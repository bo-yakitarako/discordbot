import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScoreAttackHistories1611434251505 implements MigrationInterface {
  name = 'CreateScoreAttackHistories1611434251505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "score_attack_histories" ("historyId" SERIAL NOT NULL, "discordId" character varying(64) NOT NULL, "guildId" character varying(64) NOT NULL, "title" character varying(256) NOT NULL, "url" character varying(256) NOT NULL, "artist" character varying(128) NOT NULL DEFAULT '', "artistWebsite" character varying(256) DEFAULT null, "hash" character varying(32) NOT NULL, "mapperName" character varying(32) NOT NULL, "mapperDisplayName" character varying(256) DEFAULT null, "difficulty" integer NOT NULL, "level" integer NOT NULL, "score" integer NOT NULL, "scoreCreatedAt" character varying(32) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_75acbb8a71c00649d230d410c6c" PRIMARY KEY ("historyId"))`, // eslint-disable-line max-len
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7af312f8fed15f3e16f4f9e966" ON "score_attack_histories" ("discordId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d152b43388100844d1cfa06a63" ON "score_attack_histories" ("guildId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91b93aedcb238091df72ee77f7" ON "score_attack_histories" ("scoreCreatedAt") `, // eslint-disable-line max-len
    );
    await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."artistWebsite" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "score_attack_songs" ALTER COLUMN "artistWebsite" SET DEFAULT null`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."mapperDisplayName" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "score_attack_songs" ALTER COLUMN "mapperDisplayName" SET DEFAULT null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "score_attack_songs" ALTER COLUMN "mapperDisplayName" SET DEFAULT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."mapperDisplayName" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "score_attack_songs" ALTER COLUMN "artistWebsite" SET DEFAULT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "score_attack_songs"."artistWebsite" IS NULL`);
    await queryRunner.query(`DROP INDEX "IDX_91b93aedcb238091df72ee77f7"`);
    await queryRunner.query(`DROP INDEX "IDX_d152b43388100844d1cfa06a63"`);
    await queryRunner.query(`DROP INDEX "IDX_7af312f8fed15f3e16f4f9e966"`);
    await queryRunner.query(`DROP TABLE "score_attack_histories"`);
  }
}
