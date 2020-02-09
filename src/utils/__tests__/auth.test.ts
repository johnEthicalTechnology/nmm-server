import 'reflect-metadata'
import createJWKSMock from 'mock-jwks'

import { Authorisation } from '../Authorisation'
import { mockCustomEvent } from '../../testUtils/testMocks'
import { setUpTakeDownEnvs } from '../../testUtils/testEnvsSetup'

const TOKEN_ISSUER = 'https://test-app.com/'

describe('Authorisation class', () => {
  setUpTakeDownEnvs()

  describe('[Auth.checkScopesAndResolve()] is given an event with a [VALID] Bearer authorization token & [VALID & CORRECT] scope', () => {
    it('Returns - test user', async () => {
      const authorisation = new Authorisation()

      const jwksMock = createJWKSMock(TOKEN_ISSUER)
      await jwksMock.start()

      const accessToken = jwksMock.token({
        aud: ['https://test-app.com/test/'],
        iss: TOKEN_ISSUER,
        sub: 'test-user',
        scope: 'correct scope'
      })
      const mockedEvent = mockCustomEvent({
        authorization: `Bearer ${accessToken}`
      })

      await expect(
        authorisation.checkScopesAndResolve(mockedEvent, ['correct', 'scope'])
      ).resolves.toEqual('test-user')
      await jwksMock.stop()
    })
  })

  describe('[Auth.checkScopesAndResolve()] ERRORS', () => {
    describe('Given an event with an [INVALID] authorisation Bearer token', () => {
      it('Returns - Error: Invalid Token', async () => {
        const authorisation = new Authorisation()
        const mockedEvent = mockCustomEvent({
          authorization: 'Bearer invalid token'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('Invalid Token'))
      })
    })

    describe('Given an event with [NO] authorisation Bearer token', () => {
      it('Returns - Expected "event.headers.authorization" parameter to be set', () => {
        const authorisation = new Authorisation()
        const mockedEvent = mockCustomEvent({
          authorization: ''
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Expected "event.headers.authorization" parameter to be set'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] authorisation token', () => {
      it(`Returns - Invalid Authorization token - '' does not match "Bearer .*"`, () => {
        const authorisation = new Authorisation()
        const mockedEvent = mockCustomEvent({
          authorization: 'Bearer'
        })

        expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(
          new Error(
            'Invalid Authorization token - Bearer does not match "Bearer .*"'
          )
        )
      })
    })

    describe('Given an event with an [EMPTY] scope', () => {
      it('Returns - No scopes supplied!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: ''
        })
        const mockedEvent = mockCustomEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('No scopes supplied!'))
        await jwksMock.stop()
      })
    })

    describe('Given an event with an [INCORRECT] scope', () => {
      it('Returns - You are not authorized!', async () => {
        const authorisation = new Authorisation()
        const jwksMock = createJWKSMock(TOKEN_ISSUER)
        await jwksMock.start()

        const accessToken = jwksMock.token({
          aud: ['https://test-app.com/test/'],
          iss: TOKEN_ISSUER,
          sub: 'test-user',
          scope: 'incorrect scope'
        })

        const mockedEvent = mockCustomEvent({
          authorization: `Bearer ${accessToken}`
        })

        await expect(
          authorisation.checkScopesAndResolve(mockedEvent, ['correct scope'])
        ).rejects.toEqual(new Error('You are not authorized!'))
        await jwksMock.stop()
      })
    })
  })
})
