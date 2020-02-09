import { Connection } from 'typeorm'
import { ApolloServer } from 'apollo-server-lambda'
import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  Challenge,
  ChallengeInput,
  Recipe,
  UserProfile,
  UserProfileInput,
  RecipeAttribution,
  TypeEnum
} from './graphql/types'
import { LambdaLog } from 'lambda-log'

export interface IEnvs {
  audience: string
  issuer: string
  jwksUri: string
  silentLogger: boolean
}
export interface IServer {
  getApolloInstance(): ApolloServer
}

export interface IDatabase {
  getConnection(): Promise<Connection>
}

export interface ILogger {
  getLogger(): LambdaLog
  createContext(arg0?: APIGatewayProxyEvent, arg1?: Context): void
}

export interface IResolverContext {
  event: APIGatewayProxyEvent
  log: LambdaLog
  auth: IAuthorisation
  // TODO - fix the any type
  dataSources: any
}

// AUTHORISATION
export interface IVerifiedToken {
  [index: string]: any
  iss: string
  sub: string
  aud: [string]
  iat: number
  exp: number
  azp: string
  scope: string
}

export interface IDecodedToken {
  header: {
    typ: string
    alg: string
    kid: string
  }
  payload: {
    iss: string
    sub: string
    aud: [string]
    iat: number
    exp: number
    azp: string
    scope: string
  }
  signature: string
}

export interface IScopeAndId {
  principleId: string
  scopes: Array<string>
}

export interface IAuthorisation {
  checkScopesAndResolve(
    arg0: APIGatewayProxyEvent,
    arg1: Array<string>,
    arg3?: LambdaLog
  ): Promise<string>
}

export interface IModifiedObject {
  [name: string]: string
}

// DATASOURCES
export interface IRecipeAPI extends DataSource {
  findRecipe(arg0?: number, arg1?: string): Promise<Recipe | undefined>
  findAttribution(
    arg0?: number,
    arg1?: string
  ): Promise<RecipeAttribution | undefined>
  findAllRecipes(): Promise<Array<Recipe>>
  createRecipe(args: any): Promise<Recipe>
  deleteRecipe(arg0?: number, arg1?: string): Promise<Recipe>
}

export interface IUserProfileAPI extends DataSource {
  createUserProfile(arg0: UserProfileInput, arg1?: string): Promise<UserProfile>
  findUserProfile(arg0: string, arg1?: string): Promise<UserProfile | undefined>
  initialize(arg0?: DataSourceConfig<any>): void
  closeDbConnection(): void
}

export interface IChallengeAPI extends DataSource {
  findChallenge(arg0: number, arg1: string): Promise<Challenge | undefined>
  createOrUpdateChallenge(
    arg0: ChallengeInput,
    arg1: TypeEnum,
    arg2: string
  ): Promise<Challenge>
  closeDbConnection(): void
  initialize(arg0?: DataSourceConfig<any>): void
}

export interface ICalculatePoints {
  calculate(
    arg0: ChallengeInput | UserProfileInput,
    arg1: string,
    arg2?: number
  ): number
}
