import { Connection } from 'typeorm'
import { ApolloServer } from 'apollo-server-lambda'
import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import {
  ChallengeInput,
  Recipe,
  UserProfile,
  UserProfileInput,
  RecipeAttribution,
  TypeEnum
} from './graphql/types'
import ChallengeEntity from './db/entities/Challenge'
import { LambdaLog } from 'lambda-log'
import { MealTypeEnum } from './graphql/types'

export interface ExtendedAPIGatewayProxyEvent extends APIGatewayProxyEvent {
  source: any
}

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
  createContext(arg0?: ExtendedAPIGatewayProxyEvent, arg1?: Context): void
}

export interface IResolverContext {
  event: ExtendedAPIGatewayProxyEvent
  log: LambdaLog
  auth: IAuthorisation
  // TODO - fix the any type
  dataSources: any
}

export interface IUserProfileId {
  userProfileId: string
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
    arg0: ExtendedAPIGatewayProxyEvent,
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
  findRecipesByMealType(arg0: MealTypeEnum): Promise<Array<Recipe>>
  createRecipe(args: any): Promise<Recipe>
  deleteRecipe(arg0?: number, arg1?: string): Promise<Recipe>
}

export interface IUserProfileAPI extends DataSource {
  createOrUpdateUserProfile(
    arg0: UserProfileInput,
    arg1?: string
  ): Promise<UserProfile | ChallengeEntity>
  findUserProfile(arg0: string, arg1?: string): Promise<UserProfile | undefined>
  initialize(arg0?: DataSourceConfig<any>): void
  closeDbConnection(): void
  deleteUserProfile(arg0: string): Promise<string>
}

export interface IChallengeAPI extends DataSource {
  findChallenge(
    arg0: number,
    arg1: string
  ): Promise<ChallengeEntity | undefined>
  createOrUpdateChallenge(
    arg0: ChallengeInput,
    arg1: TypeEnum,
    arg2: string
  ): Promise<ChallengeEntity>
  closeDbConnection(): void
  initialize(arg0?: DataSourceConfig<any>): void
}

export interface ICalculatePoints {
  calculate(
    arg0: ChallengeInput | UserProfileInput,
    arg1: ChallengeEntity,
    arg2: string
  ): {
    updatedChallenge: ChallengeEntity
    amountToAddToUserProfile: number
  }
}
