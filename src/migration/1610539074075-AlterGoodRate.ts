import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterGoodRate1610539074075 implements MigrationInterface {
  name = 'AlterGoodRate1610539074075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "good_rate" DROP COLUMN "rate"`);
    await queryRunner.query(`ALTER TABLE "good_rate" ADD "rate" double precision NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "good_rate" DROP COLUMN "rate"`);
    await queryRunner.query(`ALTER TABLE "good_rate" ADD "rate" numeric NOT NULL DEFAULT '0'`);
  }
}
