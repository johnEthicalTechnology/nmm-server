import { gql } from 'apollo-server-lambda'

export default gql`
  type Mutation {
    # TODO - reinstate if we get the articles function working
    # createArticles(articles: [CreateArticle]!): [Article]
    # createArticle(article: CreateArticle!): Article

    createUserProfile(userProfileInput: UserProfileInput): UserProfile

    createRecipe(recipe: RecipeInput): Recipe
    deleteRecipe(
      deleteSecret: String!
      recipeId: Int
      recipeTitle: String
    ): Recipe

    createOrUpdateChallenge(challengeInput: ChallengeInput): Challenge
  }
`
