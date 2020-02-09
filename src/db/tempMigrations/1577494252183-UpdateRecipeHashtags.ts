import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRecipeHashtags1577494252183 implements MigrationInterface {
  name = 'UpdateRecipeHashtags1577494252183'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" DROP COLUMN "hashtags"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ADD "hashtags" text`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" DROP COLUMN "hashtags"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ADD "hashtags" character varying NOT NULL`,
      undefined
    )
  }
}
