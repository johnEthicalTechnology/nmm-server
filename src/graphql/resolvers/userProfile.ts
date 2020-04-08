import { IResolverContext, IUserProfileId } from '../../types'
import { UserProfile, UserProfileInput } from '../types'

export default {
  Query: {
    me: async (
      _: any,
      { userProfileId }: { userProfileId: string },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        console.info('Resolver - User Profile:', event)
        console.info(`Authorising user ${userProfileId}...`)
        const verifiedUserProfileId = await auth.checkScopesAndResolve(event, [
          'profile'
        ])
        console.info(
          `Authorisation of user ${verifiedUserProfileId} successful!`
        )
        const userProfile = await dataSources.userProfileAPI.findUserProfile(
          verifiedUserProfileId
        )
        return userProfile
      } catch (error) {
        console.error(`User Profile - Couldn't find user profile: ${error}`)
        return error
      }
    }
  },
  Mutation: {
    createOrUpdateUserProfile: async (
      _: any,
      { userProfileInput }: { userProfileInput: UserProfileInput },
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        console.info(`Authorising user ${userProfileInput.id}...`)
        const verifiedUserId = await auth.checkScopesAndResolve(event, [
          'profile'
        ])
        console.info(`Authorisation of user ${userProfileInput.id} successful!`)

        console.info(`Creating profile for user ${verifiedUserId}...`)
        const createdUserProfile = await dataSources.userProfileAPI.createOrUpdateUserProfile(
          userProfileInput,
          'UserProfile'
        )

        console.info(`User profile for ${createdUserProfile.id} created.`)
        return createdUserProfile
      } catch (error) {
        console.error(`Couldn't find user: ${error}`)
        return error
      }
    },
    deleteUserProfile: async (
      _: any,
      userProfileId: IUserProfileId,
      { auth, dataSources, log, event }: IResolverContext
    ): Promise<UserProfile> => {
      try {
        console.log('userProfileId', userProfileId)

        console.info(`Authorising user ${userProfileId.userProfileId}...`)
        const verifiedUserId = await auth.checkScopesAndResolve(event, [
          'profile'
        ])
        console.info(
          `Authorisation of user ${userProfileId.userProfileId} successful!`
        )

        console.info(`Deleting profile for user ${verifiedUserId}...`)
        const deletedUserProfile = await dataSources.userProfileAPI.deleteUserProfile(
          verifiedUserId
        )

        console.info(`User profile for ${deletedUserProfile.id} deleted.`)
        return deletedUserProfile
      } catch (error) {
        console.error(`Couldn't find user: ${error}`)
        return error
      }
    }
  }
}
