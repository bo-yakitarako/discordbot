import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoodRate1610498038830 implements MigrationInterface {
  name = 'CreateGoodRate1610498038830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "good_rate" ("id" SERIAL NOT NULL, "rate" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0cd47a618b4610f968a24eb00c5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "good_rate"`);
  }
}
