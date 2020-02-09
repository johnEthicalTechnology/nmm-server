import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRecipeHashtagsNotNull1577510694584
  implements MigrationInterface {
  name = 'UpdateRecipeHashtagsNotNull1577510694584'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "hashtags" SET NOT NULL`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "hashtags" DROP NOT NULL`,
      undefined
    )
  }
}
