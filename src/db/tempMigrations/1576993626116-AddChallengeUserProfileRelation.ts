import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddChallengeUserProfileRelation1576993626116
  implements MigrationInterface {
  name = 'AddChallengeUserProfileRelation1576993626116'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD "userProfileId" character varying`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_603e66e0687f269b699f3f5cf22" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_603e66e0687f269b699f3f5cf22"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP COLUMN "userProfileId"`,
      undefined
    )
  }
}
