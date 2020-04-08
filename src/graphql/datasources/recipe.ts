import { injectable, inject } from 'inversify'
import { ForbiddenError, UserInputError } from 'apollo-server-lambda'
// DB Entities
import RecipeEntity from '../../db/entities/Recipe'
import RecipeAttributionEntity from '../../db/entities/RecipeAttribution'
// TYPES
import { RecipeInput, MealTypeEnum } from '../types'
import { IRecipeAPI, IDatabase } from '../../types'

import { DataSourceConfig } from 'apollo-datasource'
import { TYPES } from '../../inversifyTypes'

@injectable()
export default class RecipeAPI implements IRecipeAPI {
  private context: any
  private readonly database: IDatabase
  public constructor(@inject(TYPES.Database) database: IDatabase) {
    this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  public async findAllRecipes() {
    const db = await this.database.getConnection()
    const recipes = await db.getRepository(RecipeEntity).find()

    return recipes
  }

  public async findAttribution(id: number, name: string) {
    const db = await this.database.getConnection()
    const attribution = await db
      .getRepository(RecipeAttributionEntity)
      .findOne({
        where: [{ id }, { name }]
      })

    return attribution
  }

  public async findRecipe(id: number, title: string) {
    const db = await this.database.getConnection()
    const recipe = await db.getRepository(RecipeEntity).findOne({
      where: [{ id }, { title }]
    })

    if (!recipe)
      throw new UserInputError(
        `The recipe with title "${title}" or "${id}" doesn't exist. Come on mate, have a go!`
      )
    console.log(recipe)

    return recipe
  }

  public async findRecipesByMealType(mealType: MealTypeEnum) {
    const db = await this.database.getConnection()
    const recipes = await db
      .getRepository(RecipeEntity)
      .createQueryBuilder('recipe')
      .where('recipe.mealType = :mealType', { mealType })
      .orderBy('RANDOM()')
      .limit(3)
      .getMany()

    console.log('get recipes', recipes)

    return recipes
  }

  public async deleteRecipe(id: number, title: string): Promise<any> {
    const db = await this.database.getConnection()
    const recipeToDelete = await db.getRepository(RecipeEntity).findOne({
      where: [{ id }, { title }]
    })

    if (!recipeToDelete)
      throw new UserInputError(
        `The recipe with title "${title}" or "${id}" doesn't exist. Have go mate!`
      )

    const countRecipesToAttribution = await db
      .getRepository(RecipeEntity)
      .findAndCount({
        where: { recipeAttributionId: recipeToDelete.recipeAttributionId }
      })

    const LAST_AND_ONLY_RECIPE = 1
    const INDEX_FOR_COUNT = 1
    if (countRecipesToAttribution[INDEX_FOR_COUNT] == LAST_AND_ONLY_RECIPE) {
      const recipeAttribution = await db
        .getRepository(RecipeAttributionEntity)
        .find({ id: recipeToDelete.recipeAttributionId })
      await db.getRepository(RecipeAttributionEntity).remove(recipeAttribution)
    }

    const deletedRecipe = await db
      .getRepository(RecipeEntity)
      .remove(recipeToDelete)

    return deletedRecipe
  }

  public async createRecipe({
    title,
    ingredients,
    method,
    hashtags,
    difficulty,
    cost,
    mealType,
    lowResolution,
    standardResolution,
    name,
    email,
    website = 'Website information is not available.',
    facebook = 'Facebook profile not available',
    instagram = 'Instagram profile not available',
    twitter = 'Twitter profile not available'
  }: RecipeInput) {
    const db = await this.database.getConnection()

    const duplicateRecipe = await db.getRepository(RecipeEntity).findOne({
      where: { title }
    })

    if (duplicateRecipe)
      throw new UserInputError(
        `The title "${duplicateRecipe.title}" is taken by another recipe. Change the title and/or delete recipe number ${duplicateRecipe.id}`
      )

    let recipe = new RecipeEntity()
    recipe.title = title
    recipe.ingredients = ingredients
    recipe.method = method
    recipe.hashtags = hashtags
    recipe.difficulty = difficulty
    recipe.cost = cost
    recipe.mealType = mealType
    recipe.lowResolution = lowResolution
    recipe.standardResolution = standardResolution

    let foundChef
    foundChef = await db.getRepository(RecipeAttributionEntity).findOne({
      where: { name }
    })

    if (foundChef) recipe.recipeAttribution = foundChef
    else {
      let recipeAttribution = new RecipeAttributionEntity()
      recipeAttribution.name = name
      recipeAttribution.email = email
      recipeAttribution.website = website!
      recipeAttribution.facebook = facebook!
      recipeAttribution.instagram = instagram!
      recipeAttribution.twitter = twitter!

      recipe.recipeAttribution = recipeAttribution
    }

    const savedRecipe = await db.getRepository(RecipeEntity).save(recipe)

    return savedRecipe
  }
}
