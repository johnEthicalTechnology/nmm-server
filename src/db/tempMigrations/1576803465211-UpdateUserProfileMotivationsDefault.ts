import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserProfileMotivationsDefault1576803465211
  implements MigrationInterface {
  name = 'UpdateUserProfileMotivationsDefault1576803465211'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP COLUMN "motivations"`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "user_profile_motivations_enum" AS ENUM('Environment', 'Animal Welfare', 'Food Security', 'Personal Health')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD "motivations" "user_profile_motivations_enum" array NOT NULL`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP COLUMN "motivations"`,
      undefined
    )
    await queryRunner.query(
      `DROP TYPE "user_profile_motivations_enum"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD "motivations" character varying NOT NULL`,
      undefined
    )
  }
}
