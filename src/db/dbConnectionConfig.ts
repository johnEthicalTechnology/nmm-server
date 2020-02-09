import Recipe from './entities/Recipe'
import RecipeAttribution from './entities/RecipeAttribution'
import UserProfile from './entities/UserProfile'
import Challenge from './entities/Challenge'
import UncompletedChallenge from './entities/UncompletedChallenge'
import CompletedChallenge from './entities/CompletedChallenge'

import { ConnectionOptions } from 'typeorm'

const entities = [
  Recipe,
  RecipeAttribution,
  UserProfile,
  Challenge,
  CompletedChallenge,
  UncompletedChallenge
]

export const prod: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: 'all',
  logger: 'advanced-console',
  dropSchema: false,
  entities
}

export const test: ConnectionOptions = {
  name: 'test',
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'test-no-meat-may',
  password: '',
  database: 'test-no-meat-may',
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities
}

export const dev: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  port: 5432,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: 'all',
  dropSchema: false,
  entities
}
