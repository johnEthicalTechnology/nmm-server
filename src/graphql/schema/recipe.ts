const { gql } = require('apollo-server-lambda')

export default gql`
  enum DifficultyEnum {
    Easy
    Medium
    Hard
  }

  enum CostEnum {
    Budget
    Moderate
    Expensive
  }

  enum MealTypeEnum {
    Breakfast
    Lunch
    Dinner
    Snack
  }

  input RecipeInput {
    title: String!
    email: String!
    name: String!
    ingredients: [String!]!
    method: [String!]!
    hashtags: [String!]!
    difficulty: DifficultyEnum!
    cost: CostEnum!
    mealType: MealTypeEnum!
    lowResolution: String!
    standardResolution: String!
    website: String
    facebook: String
    instagram: String
    twitter: String
    videoUrl: String
  }

  type Recipe {
    "**LIST && SHOW**"
    id: ID
    title: String!
    difficulty: DifficultyEnum!
    cost: CostEnum!
    mealType: MealTypeEnum!
    hashtags: [String!]!
    "**LIST**"
    lowResolution: String!
    "**SHOW**"
    recipeAttribution: RecipeAttribution
    ingredients: [String!]!
    method: [String!]!
    standardResolution: String!
    videoUrl: String
  }

  type RecipeAttribution {
    id: ID
    name: String
    website: String
    email: String
    facebook: String
    instagram: String
    twitter: String
  }
`
