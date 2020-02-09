import 'reflect-metadata'

import { container } from '../../../inversify.config'
import { TYPES } from '../../../inversifyTypes'
import { IChallengeAPI, IUserProfileAPI } from '../../../types'
import { setUpTakeDownEnvs } from '../../../testUtils/testEnvsSetup'
import { Authorisation } from '../../../utils/Authorisation'
import log from '../../../utils/Logger'
// TYPES
import challengeResolver from '../../resolvers/challenge'
import { jwksMock, setUpAuthToken } from '../../../testUtils/testJwksSetup'
import { mockPartialCompletionRecipeChallenge } from '../../../testUtils/testMocks'
import { MotivationsEnum } from '../../types'

describe('Resolver - [Challenge]', () => {
  setUpTakeDownEnvs()
  afterEach(async () => {
    await jwksMock.stop()
  })

  describe('Mutation', () => {
    describe('For [createOrUpdateChallenge]', () => {
      const challengeAPI = container.get<IChallengeAPI>(TYPES.ChallengeAPI)
      const userProfileAPI = container.get<IUserProfileAPI>(
        TYPES.UserProfileAPI
      )
      beforeAll(async () => {
        await userProfileAPI.initialize({
          context: jest.fn(),
          cache: {
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn()
          }
        })
        await userProfileAPI.createUserProfile(
          {
            id: 'testuserid',
            motivations: [MotivationsEnum.AnimalWelfare],
            challengeGoals: 5,
            username: 'test user',
            bio: 'test bio',
            challengeQuote: 'test challenge quote',
            lowResProfile: 'test user profile pic'
          },
          'createUserProfile'
        )
      })
      afterEach(() => {
        challengeAPI.closeDbConnection()
      })
      describe('For [HAPPY PATH]', () => {
        it('Returned - challenge', async () => {
          const mockedEvent = await setUpAuthToken('challenge')

          // Initialize is called by ApolloServer when being setup
          // The DB is set up in this function which is why it's necessary
          // to call it here
          await challengeAPI.initialize({
            context: jest.fn(),
            cache: {
              get: jest.fn(),
              set: jest.fn(),
              delete: jest.fn()
            }
          })

          const mockContext = {
            dataSources: {
              challengeAPI
            },
            event: mockedEvent,
            log: new log().getLogger(),
            auth: new Authorisation()
          }

          const res = await challengeResolver.Mutation.createOrUpdateChallenge(
            null,
            { challengeInput: mockPartialCompletionRecipeChallenge },
            mockContext
          )
          const maxAwardablePointsForRecipe = 65
          const awardedPointsForOneSectionCompleted = 10
          const maxSectionsCompletableForRecipe = 4
          expect(res).toHaveProperty('updatedAt')
          expect(res).toHaveProperty('createdAt')
          expect(res).toHaveProperty('id')
          expect(res).toHaveProperty(
            'type',
            mockPartialCompletionRecipeChallenge.type
          )
          expect(res).toHaveProperty('difficulty', 1)
          expect(res).toHaveProperty(
            'maxAwardablePoints',
            maxAwardablePointsForRecipe
          )
          expect(res).toHaveProperty(
            'awardedPoints',
            awardedPointsForOneSectionCompleted
          )
          expect(res).toHaveProperty(
            'maxSectionsCompletable',
            maxSectionsCompletableForRecipe
          )
          expect(res).toHaveProperty(
            'sectionsCompleted',
            mockPartialCompletionRecipeChallenge.sectionsCompleted
          )
        })
      })
      describe('For [ERROR] states', () => {
        it('[WITHOUT USER] Returned - Error: UserProfile totalPoints not update. Try again!', async () => {
          const mockedEvent = await setUpAuthToken('challenge')

          // Initialize is called by ApolloServer when being setup
          // The DB is set up in this function which is why it's necessary
          // to call it here
          await challengeAPI.initialize({
            context: jest.fn(),
            cache: {
              get: jest.fn(),
              set: jest.fn(),
              delete: jest.fn()
            }
          })

          const mockContext = {
            dataSources: {
              challengeAPI
            },
            event: mockedEvent,
            log: new log().getLogger(),
            auth: new Authorisation()
          }

          await expect(
            challengeResolver.Mutation.createOrUpdateChallenge(
              null,
              { challengeInput: mockPartialCompletionRecipeChallenge },
              mockContext
            )
          ).rejects.toThrow('UserProfile totalPoints not updated. Try again!')
        })
      })
    })
  })
})
