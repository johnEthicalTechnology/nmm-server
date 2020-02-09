import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUnAndCompleteChallenge1576999386535
  implements MigrationInterface {
  name = 'UpdateUnAndCompleteChallenge1576999386535'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" DROP CONSTRAINT "FK_b84b51ae286dc59f6c06ef19292"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" DROP CONSTRAINT "FK_3995c8b4c0a5357774c0dd457fc"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" RENAME COLUMN "userId" TO "userProfileId"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" RENAME COLUMN "userId" TO "userProfileId"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" ADD CONSTRAINT "FK_3a2f20192524be6ec75a80b71b1" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" ADD CONSTRAINT "FK_92da64043dcdb46541b140d45eb" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" DROP CONSTRAINT "FK_92da64043dcdb46541b140d45eb"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" DROP CONSTRAINT "FK_3a2f20192524be6ec75a80b71b1"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" RENAME COLUMN "userProfileId" TO "userId"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" RENAME COLUMN "userProfileId" TO "userId"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" ADD CONSTRAINT "FK_3995c8b4c0a5357774c0dd457fc" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" ADD CONSTRAINT "FK_b84b51ae286dc59f6c06ef19292" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
  }
}
