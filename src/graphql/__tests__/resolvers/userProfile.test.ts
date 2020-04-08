import 'reflect-metadata'

import { container } from '../../../inversify.config'
import { TYPES } from '../../../inversifyTypes'
import { IUserProfileAPI } from '../../../types'
import { setUpTakeDownEnvs } from '../../../testUtils/testEnvsSetup'
import { Authorisation } from '../../../utils/Authorisation'
import log from '../../../utils/Logger'
// TYPES
import userProfileResolver from '../../resolvers/userProfile'
import { jwksMock, setUpAuthToken } from '../../../testUtils/testJwksSetup'
import {
  mockMaxUserProfileInput,
  mockMaxTotalPoints
} from '../../../testUtils/testMocks'

describe('Resolvers - [UserProfile]', () => {
  setUpTakeDownEnvs()
  afterEach(async () => {
    await jwksMock.stop()
  })

  describe('Query', () => {
    it('[ME] Returned - user profile', async () => {
      const mockedEvent = await setUpAuthToken('profile')

      const mockContext = {
        dataSources: {
          userProfileAPI: { findUserProfile: jest.fn() }
        },
        event: mockedEvent,
        log: new log().getLogger(),
        auth: new Authorisation()
      }

      mockContext.dataSources.userProfileAPI.findUserProfile.mockReturnValueOnce(
        [mockMaxUserProfileInput]
      )

      const res = await userProfileResolver.Query.me(
        null,
        { id: 'testuserid' },
        mockContext
      )

      expect(res).toEqual([mockMaxUserProfileInput])
    })
  })

  // * N.B. This needs Test DB connection to pass * \\
  describe('Mutation', () => {
    const userProfileAPI = container.get<IUserProfileAPI>(TYPES.UserProfileAPI)
    afterEach(() => {
      userProfileAPI.closeDbConnection()
    })
    it('[CREATE PROFILE] Returned - user profile', async () => {
      const mockedEvent = await setUpAuthToken('profile')

      // Initialize is called by ApolloServer when being setup
      // The DB is set up in this function which is why it's necessary
      // to call it here
      await userProfileAPI.initialize({
        context: jest.fn(),
        cache: {
          get: jest.fn(),
          set: jest.fn(),
          delete: jest.fn()
        }
      })

      const mockContext = {
        dataSources: {
          userProfileAPI
        },
        event: mockedEvent,
        log: new log().getLogger(),
        auth: new Authorisation()
      }

      const res = await userProfileResolver.Mutation.createOrUpdateUserProfile(
        null,
        { userProfileInput: mockMaxUserProfileInput },
        mockContext
      )

      expect(res).toHaveProperty('updatedAt')
      expect(res).toHaveProperty('createdAt')
      expect(res).toHaveProperty('id', mockMaxUserProfileInput.id)
      expect(res).toHaveProperty('username', mockMaxUserProfileInput.username)
      expect(res).toHaveProperty('bio', mockMaxUserProfileInput.bio)
      expect(res).toHaveProperty(
        'challengeGoals',
        mockMaxUserProfileInput.challengeGoals
      )
      expect(res).toHaveProperty(
        'motivations',
        mockMaxUserProfileInput.motivations
      )
      expect(res).toHaveProperty(
        'standardResolution',
        mockMaxUserProfileInput.standardResolution
      )
      expect(res).toHaveProperty('totalPoints', mockMaxTotalPoints)
    })
  })
})
