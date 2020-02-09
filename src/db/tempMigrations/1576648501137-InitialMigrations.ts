import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigrations1576648501137 implements MigrationInterface {
  name = 'InitialMigrations1576648501137'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "recipe_attribution" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "website" character varying NOT NULL, "email" character varying NOT NULL, "facebook" character varying NOT NULL, "instragram" character varying NOT NULL, "twitter" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfbfc1974499381d97110b472e8" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "recipe_difficulty_enum" AS ENUM('Easy', 'Medium', 'Hard')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "recipe_cost_enum" AS ENUM('Budget', 'Moderate', 'Expensive')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "recipe_mealtype_enum" AS ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "ingredients" text NOT NULL, "method" text NOT NULL, "hashtags" character varying NOT NULL, "difficulty" "recipe_difficulty_enum" NOT NULL, "cost" "recipe_cost_enum" NOT NULL, "mealType" "recipe_mealtype_enum" NOT NULL, "lowResolution" character varying NOT NULL, "standardResolution" character varying NOT NULL, "recipeAttributionId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_type_enum" AS ENUM('Recipe', 'Article')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_difficulty_enum" AS ENUM('1', '1.15', '1.3')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_sectionscompleted_enum" AS ENUM('None', 'Ingredients', 'Method', 'SharedFriendsImage', 'SharedRecipe', 'ReadArticle', 'SharedArticle')`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "challenge" ("id" SERIAL NOT NULL, "type" "challenge_type_enum" NOT NULL DEFAULT 'Recipe', "difficulty" "challenge_difficulty_enum" NOT NULL DEFAULT '1', "maxAwardablePoints" integer, "awardedPoints" integer, "maxSectionsCompletable" integer, "sectionsCompleted" "challenge_sectionscompleted_enum" array NOT NULL DEFAULT '{None}', "sharedFriendsImages" text, "recipeId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5f31455ad09ea6a836a06871b7a" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" character varying NOT NULL, "totalPoints" integer NOT NULL, "challengeGoals" integer NOT NULL, "motivations" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying NOT NULL, "lowResProfile" character varying NOT NULL, "standardResolution" character varying NOT NULL, "challengeQuote" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ADD CONSTRAINT "FK_5f4d1a9141da6d3cc6a2bf41b5f" FOREIGN KEY ("recipeAttributionId") REFERENCES "recipe_attribution"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ADD CONSTRAINT "FK_0154407dd3b69cae049d5ba72f8" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "challenge" DROP CONSTRAINT "FK_0154407dd3b69cae049d5ba72f8"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" DROP CONSTRAINT "FK_5f4d1a9141da6d3cc6a2bf41b5f"`,
      undefined
    )
    await queryRunner.query(`DROP TABLE "user_profile"`, undefined)
    await queryRunner.query(`DROP TABLE "challenge"`, undefined)
    await queryRunner.query(
      `DROP TYPE "challenge_sectionscompleted_enum"`,
      undefined
    )
    await queryRunner.query(`DROP TYPE "challenge_difficulty_enum"`, undefined)
    await queryRunner.query(`DROP TYPE "challenge_type_enum"`, undefined)
    await queryRunner.query(`DROP TABLE "recipe"`, undefined)
    await queryRunner.query(`DROP TYPE "recipe_mealtype_enum"`, undefined)
    await queryRunner.query(`DROP TYPE "recipe_cost_enum"`, undefined)
    await queryRunner.query(`DROP TYPE "recipe_difficulty_enum"`, undefined)
    await queryRunner.query(`DROP TABLE "recipe_attribution"`, undefined)
  }
}
