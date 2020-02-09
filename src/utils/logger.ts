import { injectable } from 'inversify'
import log from 'lambda-log'
import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { ILogger } from '../types'

// N.B. Overkill with class, but want to practice with classes in this project
@injectable()
export default class Logger implements ILogger {
  // N.B. making type log: LambdaLog gives me an error REF daily tech note 24/11/19
  // TODO - fix any TYPE for log
  private log: any

  public constructor() {
    this.log = log
  }

  createContext(event?: APIGatewayProxyEvent, context?: Context) {
    this.log.options.meta.requestContext = event!.requestContext
    this.log.options.meta.awsRequestId = context!.awsRequestId
  }

  getLogger() {
    this.log.options.dev = process.env.DEV_LOGGING
    this.log.options.silent = process.env.SILENT_LOGGING
    this.log.options.debug = process.env.DEBUG_LOGGING
    return this.log
  }
}
