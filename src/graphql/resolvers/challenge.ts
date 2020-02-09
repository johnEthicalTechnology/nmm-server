import { Challenge, ChallengeInput } from '../types'
import { IResolverContext } from '../../types'

export default {
  Query: {
    challenge: async (
      _: any,
      { recipeId }: { recipeId: number },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<Challenge> => {
      log.info(`Authorising user to find challenge...`)
      const verifiedUserId = await auth.checkScopesAndResolve(event, [
        'challenge'
      ])
      log.info(`Authorisation of user ${verifiedUserId} successful!`)

      log.info('Finding challenge')
      const challenge = await dataSources.challengeAPI.findChallenge(
        recipeId,
        verifiedUserId
      )
      log.info('Found challenge')
      return challenge
    }
  },
  Mutation: {
    createOrUpdateChallenge: async (
      _: any,
      { challengeInput }: { challengeInput: ChallengeInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<Challenge> => {
      try {
        log.info(`Authorising user to create challenge...`)
        const verifiedUserId = await auth.checkScopesAndResolve(event, [
          'challenge'
        ])
        log.info(`Authorisation of user ${verifiedUserId} successful!`)

        log.info(`Creating challenge for ${verifiedUserId}`)
        const createdChallenge = await dataSources.challengeAPI.createOrUpdateChallenge(
          challengeInput,
          challengeInput.type,
          verifiedUserId
        )
        log.info('Challenge created')
        return createdChallenge
      } catch (error) {
        log.error(`Couldn't create challenge: ${error}`)
        throw new Error(error)
      }
    }
  },
  ChallengeDifficultyEnum: {
    Easy: 1,
    Medium: 1.15,
    Hard: 1.3
  }
}
