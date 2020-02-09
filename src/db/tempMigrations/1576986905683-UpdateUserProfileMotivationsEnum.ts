import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserProfileMotivationsEnum1576986905683
  implements MigrationInterface {
  name = 'UpdateUserProfileMotivationsEnum1576986905683'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TYPE "user_profile_motivations_enum" RENAME TO "user_profile_motivations_enum_old"`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "user_profile_motivations_enum" AS ENUM('Environment', 'AnimalWelfare', 'FoodSecurity', 'PersonalHealth')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" RENAME COLUMN "motivations" TO "motivations_old"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD COLUMN "motivations" "user_profile_motivations_enum" array NOT NULL`,
      undefined
    )
    // This was the old query created by the TypeORM generation
    // await queryRunner.query(
    //   `ALTER TABLE "user_profile" ALTER COLUMN "motivations" TYPE "user_profile_motivations_enum"[] USING "motivations"::"text"::"user_profile_motivations_enum"[]`,
    //   undefined
    // )
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP COLUMN "motivations_old"`,
      undefined
    )
    await queryRunner.query(
      `DROP TYPE "user_profile_motivations_enum_old"`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "user_profile_motivations_enum_old" AS ENUM('Environment', 'Animal Welfare', 'Food Security', 'Personal Health')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "motivations" TYPE "user_profile_motivations_enum_old"[] USING "motivations"::"text"::"user_profile_motivations_enum_old"[]`,
      undefined
    )
    await queryRunner.query(
      `DROP TYPE "user_profile_motivations_enum"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TYPE "user_profile_motivations_enum_old" RENAME TO  "_user_profile_motivations_enum"`,
      undefined
    )
  }
}
