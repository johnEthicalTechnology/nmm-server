import { gql } from 'apollo-server-lambda'

export default gql`
  type Article {
    id: ID!
    title: String!
    content: String!
    hashtag: [String!]!
    type: String!
  }

  input CreateArticle {
    title: String!
    content: String!
    hashtag: [String!]!
    type: String!
  }
`
