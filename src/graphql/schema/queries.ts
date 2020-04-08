const { gql } = require('apollo-server-lambda')
import { MealTypeEnum } from '../types'

export default gql`
  type Query {
    # TODO - reinstate if we get the articles function working
    # articles: [Article]
    challenge(recipeId: ID!): Challenge
    recipes: [Recipe]!
    recipe(recipeId: ID, recipeTitle: String): Recipe!
    recipesByMealType(mealType: MealTypeEnum!): [Recipe]!
    me(userProfileId: String!): UserProfile
  }
`
