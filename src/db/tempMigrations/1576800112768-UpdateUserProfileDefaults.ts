import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUserProfileDefaults1576800112768
  implements MigrationInterface {
  name = 'UpdateUserProfileDefaults1576800112768'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "bio" SET DEFAULT 'Fill in your bio for more points!'`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "lowResProfile" SET DEFAULT 'https://res.cloudinary.com/codeinaire/image/upload/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "standardResolution" SET DEFAULT 'https://res.cloudinary.com/codeinaire/image/upload/c_scale,q_auto,w_640/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "challengeQuote" SET DEFAULT 'What is a quote that inspires you to grow?'`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "challengeQuote" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "standardResolution" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "lowResProfile" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "user_profile" ALTER COLUMN "bio" DROP DEFAULT`,
      undefined
    )
  }
}
