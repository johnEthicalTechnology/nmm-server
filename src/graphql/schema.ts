import { makeExecutableSchema } from 'graphql-tools'
import { merge } from 'lodash'
// TYPE DEFS
// TODO - reinstate if we get the articles function working
// import Article from './schema/article'
import Queries from './schema/queries'
import Mutations from './schema/mutations'
import Recipe from './schema/recipe'
import UserProfile from './schema/userProfile'
import Challenge from './schema/challenge'
// RESOLVERS
// import articleResolvers from './resolvers/article'
import recipeResolvers from './resolvers/recipe'
import userProfileResolvers from './resolvers/userProfile'
import challengeResolvers from './resolvers/challenge'

export default makeExecutableSchema({
  typeDefs: [Queries, Mutations, Recipe, UserProfile, Challenge],
  resolvers: merge(
    // articleResolvers,
    challengeResolvers,
    recipeResolvers,
    userProfileResolvers
  )
})
