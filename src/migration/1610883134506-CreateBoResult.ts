import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoResult1610883134506 implements MigrationInterface {
  name = 'CreateBoResult1610883134506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bo_result" ("id" SERIAL NOT NULL, "result" varchar(32) NOT NULL DEFAULT 'kichi', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_28f16ad5d9e2b961debe22c0510" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bo_result"`);
  }
}
