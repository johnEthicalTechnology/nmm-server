import { injectable } from 'inversify'
import jwksClient, { JwksClient } from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import util from 'util'
import { ForbiddenError } from 'apollo-server-lambda'
// TYPES
import { APIGatewayProxyEvent } from 'aws-lambda'
import {
  IVerifiedToken,
  IDecodedToken,
  IScopeAndId,
  IAuthorisation
} from '../types'

@injectable()
export class Authorisation implements IAuthorisation {
  private readonly client: JwksClient
  private readonly audience: string
  private readonly issuer: string

  constructor() {
    this.client = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: process.env.JWKS_URI || ''
    })
    this.audience = process.env.AUDIENCE || ''
    this.issuer = process.env.TOKEN_ISSUER || ''
  }

  private async getSigningKey(keyId: string): Promise<string> {
    const retrieveSigningKey = util.promisify(this.client.getSigningKey)

    const retrievedKey = await retrieveSigningKey(keyId)

    return (
      (retrievedKey as jwksClient.CertSigningKey).publicKey ||
      (retrievedKey as jwksClient.RsaSigningKey).rsaPublicKey
    )
  }

  private extractBearerToken(event: APIGatewayProxyEvent): string {
    const tokenString = event.headers.authorization
    console.info('Authorisation - tokenString', tokenString)

    if (!tokenString)
      throw new ForbiddenError(
        'Expected "event.headers.authorization" parameter to be set'
      )

    const match = tokenString.match(/^Bearer (.*)$/)
    if (!match || match.length < 2)
      throw new ForbiddenError(
        `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
      )

    return match[1]
  }

  private async verifyToken(event: APIGatewayProxyEvent): Promise<IScopeAndId> {
    const token = this.extractBearerToken(event)

    const decoded: IDecodedToken = jwt.decode(token, {
      complete: true
    }) as IDecodedToken
    if (!decoded || !decoded.header || !decoded.header.kid)
      throw new ForbiddenError('Invalid Token')

    const rsaOrCertSigningKey: string = await this.getSigningKey(
      decoded.header.kid
    )

    const jwtOptions = {
      audience: this.audience,
      issuer: this.issuer
    }
    const verifiedToken: IVerifiedToken = (await jwt.verify(
      token,
      rsaOrCertSigningKey,
      jwtOptions
    )) as IVerifiedToken

    const scopes: Array<string> = verifiedToken.scope.split(' ')
    const addedScope: Array<string> = scopes.concat(
      verifiedToken[`${process.env.CLIENT_HOST}challenge`]
    )

    return {
      principleId: verifiedToken.sub,
      scopes: addedScope
    }
  }

  public async checkScopesAndResolve(
    event: APIGatewayProxyEvent,
    expectedScopes: Array<string>
  ): Promise<string> {
    const { principleId, scopes } = await this.verifyToken(event)

    const verifiedscopes: Array<string> = scopes

    const NO_SCOPES = 0
    if (verifiedscopes[0].length == NO_SCOPES)
      throw new ForbiddenError('No scopes supplied!')

    const scopesMatch = expectedScopes.some(
      scope => verifiedscopes.indexOf(scope) !== -1
    )

    if (scopesMatch) return principleId
    else throw new ForbiddenError('You are not authorized!')
  }
}

const authorisation = new Authorisation()
Object.freeze(authorisation)

export default authorisation
