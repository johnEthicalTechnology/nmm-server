import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm'
// Dependency injection
import { injectable, inject } from 'inversify'
import { TYPES } from '../inversifyTypes'

import { prod, test, dev } from './dbConnectionConfig'

import { IDatabase, ILogger } from '../types'
import { LambdaLog } from 'lambda-log'
/**
 * Database manager class
 */
@injectable()
export class Database implements IDatabase {
  private connectionManager: ConnectionManager
  private connection: Connection
  private readonly _logger: LambdaLog

  constructor(@inject(TYPES.Logger) Logger: ILogger) {
    this._logger = Logger.getLogger()
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(): Promise<Connection> {
    this._logger.info('Selecting current environment')
    const currentEnv =
      process.env.ENV == 'prod'
        ? 'prod'
        : process.env.ENV == 'test'
        ? 'test'
        : 'dev'
    const CONNECTION_NAME =
      currentEnv == 'prod' || currentEnv == 'dev' ? 'default' : 'test'

    if (this.connectionManager.has(CONNECTION_NAME)) {
      this._logger.info(`Using existing DB connection for ${currentEnv}`)
      this.connection = await this.connectionManager.get(CONNECTION_NAME)

      if (!this.connection.isConnected)
        this.connection = await this.connection.connect()
    } else {
      this._logger.info(`Creating DB connection for ${currentEnv}`)

      let connectionOptions: ConnectionOptions = dev
      if (currentEnv == 'prod') connectionOptions = prod
      if (currentEnv == 'test') connectionOptions = test

      this.connection = await createConnection(connectionOptions)
    }

    return this.connection
  }
}
