// TYPES
import { RecipeInput, Recipe } from '../types'
import { IResolverContext } from '../../types'
import RecipeEntity from '../../db/entities/Recipe'
import { RecipeAttribution } from '../types'

import { ForbiddenError } from 'apollo-server-lambda'

export default {
  Query: {
    recipes: async (
      _: any,
      __: any,
      { dataSources, log }: IResolverContext
    ): Promise<Array<Recipe>> => {
      log.info('Finding all recipes')
      const recipes = await dataSources.recipeAPI.findAllRecipes()
      log.info('Found all recipes')
      return recipes
    },
    recipe: async (
      _: any,
      { recipeId, recipeTitle }: { recipeId: number; recipeTitle: string },
      { dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      log.info(`Finding all recipe no. ${recipeId}`)
      const recipe = await dataSources.recipeAPI.findRecipe(
        recipeId,
        recipeTitle
      )
      log.info(`Found all recipe no. ${recipe.id}`)
      return recipe
    }
  },
  Mutation: {
    createRecipe: async (
      _: any,
      { recipe }: { recipe: RecipeInput },
      { dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      try {
        log.info('Creating recipe')
        const createdRecipe = await dataSources.recipeAPI.createRecipe(recipe)
        log.info('Recipe created')
        return createdRecipe
      } catch (error) {
        throw error
      }
    },
    deleteRecipe: async (
      _: any,
      {
        deleteSecret,
        recipeId,
        recipeTitle
      }: { deleteSecret: string; recipeId: number; recipeTitle: string },
      { auth, dataSources, log }: IResolverContext
    ): Promise<Recipe> => {
      try {
        const authToDelete = deleteSecret == process.env.DELETE_SECRET
        if (!authToDelete)
          throw new ForbiddenError('You are not allowed to delete! Begone!')
        log.info('Deleting recipe')
        const deletedRecipe = await dataSources.recipeAPI.deleteRecipe(
          recipeId,
          recipeTitle
        )
        log.info('Recipe deleted')
        return deletedRecipe
      } catch (error) {
        throw error
      }
    }
  },
  Recipe: {
    recipeAttribution: async (
      { recipeAttributionId }: RecipeEntity,
      __: any,
      { dataSources, log }: IResolverContext
    ): Promise<RecipeAttribution> => {
      try {
        log.info('Finding recipe attribution')
        const attribution = await dataSources.recipeAPI.findAttribution(
          recipeAttributionId
        )
        log.info('Attribution found.')
        return attribution
      } catch (error) {
        throw error
      }
    }
  }
}
