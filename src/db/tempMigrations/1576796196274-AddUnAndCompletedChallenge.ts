import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnAndCompletedChallenge1576796196274
  implements MigrationInterface {
  name = 'AddUnAndCompletedChallenge1576796196274'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "completed_challenge" ("id" SERIAL NOT NULL, "userId" character varying, "challengeId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6aca49a38bceefc003f4ad83da" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "uncompleted_challenge" ("id" SERIAL NOT NULL, "userId" character varying, "challengeId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7304d4455a20e61f1b789f79960" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" ADD CONSTRAINT "FK_b84b51ae286dc59f6c06ef19292" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" ADD CONSTRAINT "FK_fe3fe26b1eafc158e0916a13c37" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" ADD CONSTRAINT "FK_3995c8b4c0a5357774c0dd457fc" FOREIGN KEY ("userId") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" ADD CONSTRAINT "FK_8f0dbbcc13bb01ed84f23a950c2" FOREIGN KEY ("challengeId") REFERENCES "challenge"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" DROP CONSTRAINT "FK_8f0dbbcc13bb01ed84f23a950c2"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "uncompleted_challenge" DROP CONSTRAINT "FK_3995c8b4c0a5357774c0dd457fc"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" DROP CONSTRAINT "FK_fe3fe26b1eafc158e0916a13c37"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "completed_challenge" DROP CONSTRAINT "FK_b84b51ae286dc59f6c06ef19292"`,
      undefined
    )
    await queryRunner.query(`DROP TABLE "uncompleted_challenge"`, undefined)
    await queryRunner.query(`DROP TABLE "completed_challenge"`, undefined)
  }
}
