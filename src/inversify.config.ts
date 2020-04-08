import { Container } from 'inversify'

import { TYPES } from './inversifyTypes'
import { Database } from './db'
import { Authorisation } from './utils/Authorisation'
import RecipeAPI from './graphql/datasources/Recipe'
import UserProfileAPI from './graphql/datasources/UserProfile'
import Server from './server'
import Logger from './utils/Logger'
import CalculatePoints from './utils/CalculatePoints'
import ChallengeAPI from './graphql/datasources/Challenge'

import {
  IRecipeAPI,
  IUserProfileAPI,
  IServer,
  IDatabase,
  ILogger,
  IAuthorisation,
  ICalculatePoints,
  IChallengeAPI
} from './types'

const container = new Container()
container.bind<IRecipeAPI>(TYPES.RecipeAPI).to(RecipeAPI)
container.bind<IUserProfileAPI>(TYPES.UserProfileAPI).to(UserProfileAPI)
container.bind<IDatabase>(TYPES.Database).to(Database)
container.bind<IServer>(TYPES.Server).to(Server)
container.bind<ILogger>(TYPES.Logger).to(Logger)
container.bind<IAuthorisation>(TYPES.Authorisation).to(Authorisation)
container.bind<ICalculatePoints>(TYPES.CalculatePoints).to(CalculatePoints)
container.bind<IChallengeAPI>(TYPES.ChallengeAPI).to(ChallengeAPI)

export { container }
