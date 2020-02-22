const { gql } = require('apollo-server-lambda')

export default gql`
  type Query {
    # TODO - reinstate if we get the articles function working
    # articles: [Article]
    challenge(recipeId: ID!): Challenge
    recipes: [Recipe]!
    recipe(recipeId: ID, recipeTitle: String): Recipe!
    me(userProfileId: String!): UserProfile
  }
`
