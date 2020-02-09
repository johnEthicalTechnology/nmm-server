const { gql } = require('apollo-server-lambda')

export default gql`
  enum MotivationsEnum {
    Environment
    AnimalWelfare
    FoodSecurity
    PersonalHealth
  }

  type UserProfile {
    id: ID
    totalPoints: Int!
    challengeGoals: Int!
    motivations: [MotivationsEnum!]!
    username: String!
    bio: String
    lowResProfile: String
    standardResolution: String
    challengeQuote: String
  }

  input UserProfileInput {
    id: ID!
    challengeGoals: Int!
    motivations: [MotivationsEnum!]!
    username: String!
    bio: String
    lowResProfile: String
    standardResolution: String
    challengeQuote: String
  }
`
