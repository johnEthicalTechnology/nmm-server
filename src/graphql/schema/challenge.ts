const { gql } = require('apollo-server-lambda')

export default gql`
  enum ChallengeDifficultyEnum {
    Easy
    Medium
    Hard
  }

  enum TypeEnum {
    Recipe
    Article
  }

  enum SectionsCompletedEnum {
    None
    Ingredients
    Method
    SharedFriendsImage
    SharedRecipe
    ReadArticle
    SharedArticle
  }

  input ChallengeInput {
    type: TypeEnum!
    sectionsCompleted: [SectionsCompletedEnum!]!
    difficulty: ChallengeDifficultyEnum!
    lowResSharedFriendsImage: String
    standardResolution: String
    recipeId: Int!
  }

  type Challenge {
    id: ID!
    type: TypeEnum!
    difficulty: ChallengeDifficultyEnum!
    maxAwardablePoints: Int
    awardedPoints: Int
    maxSectionsCompletable: Int
    sectionsCompleted: [SectionsCompletedEnum!]!
    sharedFriendsImages: SharedFriendsImage
    userProfileId: String
    recipeId: Int
  }

  type SharedFriendsImage {
    lowResSharedFriendsImage: String
    standardResolution: String
  }
`
