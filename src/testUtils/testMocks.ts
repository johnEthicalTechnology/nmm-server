import { APIGatewayProxyEvent } from 'aws-lambda'
import { IModifiedObject } from '../types'
import {
  MotivationsEnum,
  TypeEnum,
  SectionsCompletedEnum,
  ChallengeDifficultyEnum,
  ChallengeInput,
  UserProfileInput
} from '../graphql/types'

export const mockMaxTotalPoints = 95

export const mockCompletionRecipeChallenge: ChallengeInput = {
  type: TypeEnum.Recipe,
  sectionsCompleted: [
    SectionsCompletedEnum.Ingredients,
    SectionsCompletedEnum.Method,
    SectionsCompletedEnum.SharedFriendsImage,
    SectionsCompletedEnum.SharedRecipe
  ],
  difficulty: ChallengeDifficultyEnum.Easy,
  lowResSharedFriendsImage: 'test low res image',
  standardResolution: 'test stand res image',
  recipeId: 1
}

export const mockPartialCompletionRecipeChallenge: ChallengeInput = {
  type: TypeEnum.Recipe,
  sectionsCompleted: [SectionsCompletedEnum.Ingredients],
  difficulty: ChallengeDifficultyEnum.Easy,
  lowResSharedFriendsImage: '',
  standardResolution: '',
  recipeId: 1
}

export const mockMinUserProfileInput: UserProfileInput = {
  id: 'testuserid',
  challengeGoals: 5,
  motivations: [MotivationsEnum.AnimalWelfare, MotivationsEnum.Environment],
  username: 'test user'
}

export const mockMaxUserProfileInput: UserProfileInput = {
  id: 'testuserid',
  challengeGoals: 5,
  motivations: [MotivationsEnum.AnimalWelfare, MotivationsEnum.Environment],
  username: 'test user',
  bio: 'default test bio',
  standardResolution: 'default test profile image',
  challengeQuote: 'test quote'
}

export const mockedRequestContext = {
  done: () => 'test done',
  fail: () => 'test fail',
  succeed: () => 'test succeed',
  getRemainingTimeInMillis: () => 1234,
  awsRequestId: 'offline_awsRequestId_ck3i4xrrx000823eh20psffoa',
  clientContext: {
    client: {
      installationId: 'test client',
      appTitle: 'test client',
      appVersionName: 'test client',
      appVersionCode: 'test client',
      appPackageName: 'test client'
    },
    env: {
      platformVersion: 'test env',
      platform: 'test env',
      make: 'test env',
      model: 'test env',
      locale: 'test env'
    }
  },
  functionName: 'no-meat-may-app-dev-graphql',
  functionVersion: 'offline_functionVersion_for_no-meat-may-app-dev-graphql',
  identity: {
    cognitoIdentityId: 'test string',
    cognitoIdentityPoolId: 'test pool'
  },
  invokedFunctionArn:
    'offline_invokedFunctionArn_for_no-meat-may-app-dev-graphql',
  logGroupName: 'offline_logGroupName_for_no-meat-may-app-dev-graphql',
  logStreamName: 'offline_logStreamName_for_no-meat-may-app-dev-graphql',
  memoryLimitInMB: 1233,
  callbackWaitsForEmptyEventLoop: false
}

export function mockCustomEvent(
  modificationObject: IModifiedObject
): APIGatewayProxyEvent {
  return {
    body: modificationObject.body,
    headers: {
      mockHeaders: 'mock header',
      authorization: modificationObject.authorization
    },
    httpMethod: 'POST',
    multiValueHeaders: {
      authorization: ['invalid token']
    },
    isBase64Encoded: false,
    multiValueQueryStringParameters: null,
    path: '/nmm-app',
    pathParameters: null,
    queryStringParameters: null,
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      authorizer: {
        principalId: 'offlineContext_authorizer_principalId',
        claims: [Object]
      },
      httpMethod: 'POST',
      identity: {
        accessKey: 'test string',
        accountId: 'test string',
        apiKey: 'test string',
        apiKeyId: 'test string',
        caller: 'test string',
        cognitoAuthenticationProvider: 'test string',
        cognitoAuthenticationType: 'test string',
        cognitoIdentityId: 'test string',
        cognitoIdentityPoolId: 'test string',
        principalOrgId: 'test string',
        sourceIp: 'test string',
        user: 'test string',
        userAgent: 'test string',
        userArn: 'test string'
      },
      path: 'test path',
      requestId: 'offlineContext_requestId_ck1lg5mc8000j3aeh0hjq82sm',
      requestTimeEpoch: 1570756990015,
      resourceId: 'offlineContext_resourceId',
      resourcePath: '/nmm-app',
      stage: 'dev'
    },
    resource: '/nmm-app',
    stageVariables: null
  }
}
