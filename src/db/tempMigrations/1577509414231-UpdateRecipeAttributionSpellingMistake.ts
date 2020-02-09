import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRecipeAttributionSpellingMistake1577509414231
  implements MigrationInterface {
  name = 'UpdateRecipeAttributionSpellingMistake1577509414231'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe_attribution" RENAME COLUMN "instragram" TO "instagram"`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe_attribution" RENAME COLUMN "instagram" TO "instragram"`,
      undefined
    )
  }
}
