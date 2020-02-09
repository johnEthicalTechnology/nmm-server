require('dotenv').config()
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
// Dependency injection
import { injectable, inject } from 'inversify'
import { TYPES } from './inversifyTypes'
// GRAPHQL
import schema from './graphql/schema'
// TYPES
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  IRecipeAPI,
  IServer,
  ILogger,
  IAuthorisation,
  IUserProfileAPI,
  IChallengeAPI
} from './types'

@injectable()
export default class Server implements IServer {
  private apolloServer: ApolloServer
  private readonly recipeAPI: IRecipeAPI
  private readonly userProfileAPI: IUserProfileAPI
  private readonly logger: ILogger
  private readonly authorisation: IAuthorisation
  private readonly challengeAPI: IChallengeAPI

  public constructor(
    @inject(TYPES.RecipeAPI) recipeAPI: IRecipeAPI,
    @inject(TYPES.UserProfileAPI) userProfileAPI: IUserProfileAPI,
    @inject(TYPES.Logger) Logger: ILogger,
    @inject(TYPES.Authorisation) Authorisation: IAuthorisation,
    @inject(TYPES.ChallengeAPI) challengeAPI: IChallengeAPI
  ) {
    this.recipeAPI = recipeAPI
    this.userProfileAPI = userProfileAPI
    this.logger = Logger
    this.authorisation = Authorisation
    this.challengeAPI = challengeAPI
  }
  private initContext() {
    return ({
      event,
      context
    }: {
      event: APIGatewayProxyEvent
      context: Context
    }) => {
      this.logger.createContext(event, context)
      const log = this.logger.getLogger()
      // how to set https://github.com/apollographql/apollo-server/issues/1479
      context.callbackWaitsForEmptyEventLoop = false
      return {
        event,
        log,
        auth: this.authorisation
      }
    }
  }

  private initDatasources() {
    return () => ({
      recipeAPI: this.recipeAPI,
      userProfileAPI: this.userProfileAPI,
      challengeAPI: this.challengeAPI
    })
  }

  private createApolloServer() {
    this.apolloServer = new ApolloServer({
      schema,
      dataSources: this.initDatasources(),
      context: this.initContext(),
      introspection: true,
      playground: true
    })
  }

  public getApolloInstance() {
    this.createApolloServer()
    return this.apolloServer
  }
}
