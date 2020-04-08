import { injectable, inject } from 'inversify'
import { ManagementClient } from 'auth0'
// DB Entities
import UserProfileEntity from '../../db/entities/UserProfile'
import ChallengeEntity, {
  SectionsCompletedEnum
} from '../../db/entities/Challenge'
// TYPES
import { UserProfileInput, TypeEnum } from '../types'
import { TYPES } from '../../inversifyTypes'
import { IUserProfileAPI, IDatabase, ICalculatePoints } from '../../types'
import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class UserProfileAPI implements IUserProfileAPI {
  private readonly calculatePoints: ICalculatePoints
  private readonly database: IDatabase
  private context: any

  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints,
    @inject(TYPES.Database) database: IDatabase
  ) {
    this.calculatePoints = calculatePoints
    this.database = database
  }
  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets   called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  public async deleteUserProfile(userProfileId: string) {
    const db = await this.database.getConnection()
    const checkSavedUserProfile = await db
      .getRepository(UserProfileEntity)
      .findOne({
        where: {
          id: userProfileId
        }
      })
    console.info('checkSavedUserProfile', checkSavedUserProfile)

    if (typeof checkSavedUserProfile === 'undefined')
      throw new Error('No user profile to delete!')
    else {
      const management = new ManagementClient({
        token: process.env.AUTH0_MANAGEMENT_API_TOKEN,
        clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        domain: process.env.AUTH0_MANAGEMENT_URL || '',
        scope: 'delete:users'
      })
      await management.deleteUser({
        id: userProfileId
      })
      await db.getRepository(UserProfileEntity).delete({
        id: userProfileId
      })
      return 'Deletion of user profile successful!'
    }
  }

  public async findUserProfile(verifiedUserId: string) {
    const db = await this.database.getConnection()

    const userProfile = await db.getRepository(UserProfileEntity).findOne({
      where: {
        id: verifiedUserId
      }
    })

    return userProfile
  }

  public async createOrUpdateUserProfile(
    userProfileInput: UserProfileInput,
    challengeType: string
  ) {
    const {
      id,
      motivations,
      challengeGoals,
      username,
      bio,
      lowResProfile,
      standardResolution,
      challengeQuote
    } = userProfileInput
    const db = await this.database.getConnection()

    // * 1. check if challenge exists
    let challenge: ChallengeEntity | undefined
    challenge = await db
      .getRepository(ChallengeEntity)
      .findOne({ where: { userProfileId: id, type: TypeEnum.UserProfile } })
    // * 1.a. Chek if challenge doesn't exist, create new challenge
    if (typeof challenge === 'undefined') {
      challenge = new ChallengeEntity()
      challenge.sectionsCompleted = []
      challenge.awardedPoints = 0
    }
    // * 1.b. Check if challenge is complete, if complete return Challenge
    if (challenge.completed) return challenge

    // * 2 Calculate points & update challenge entity
    const {
      updatedChallenge,
      amountToAddToUserProfile
    } = this.calculatePoints.calculate(
      userProfileInput,
      challenge,
      challengeType
    )

    // * 3.check if user profile exists
    const checkSavedUserProfile = await db
      .getRepository(UserProfileEntity)
      .findOne({
        where: {
          id
        }
      })
    let userProfile
    if (typeof checkSavedUserProfile === 'undefined') {
      userProfile = new UserProfileEntity()
      userProfile.id = id as string
      userProfile.totalPoints = amountToAddToUserProfile
      console.info(`Creating`)
    } else {
      userProfile = checkSavedUserProfile
      // * 4 Update user profile total points
      userProfile.totalPoints += amountToAddToUserProfile
    }

    // * 5 Update user profile attributes
    userProfile.motivations = motivations
    userProfile.challengeGoals = challengeGoals
    userProfile.username = username
    // N.B. If no value given, default value set in DB.
    if (typeof bio == 'string') userProfile.bio = bio
    if (typeof standardResolution == 'string')
      userProfile.standardResolution = standardResolution
    if (typeof challengeQuote == 'string')
      userProfile.challengeQuote = challengeQuote
    if (typeof lowResProfile == 'string')
      userProfile.lowResProfile = lowResProfile

    // * 6 Save and return user profile
    const savedUserProfile = await db
      .getRepository(UserProfileEntity)
      .save(userProfile)

    // * 7 Save challenge entity
    updatedChallenge.userProfile = savedUserProfile
    const savedChallenge = await db
      .getRepository(ChallengeEntity)
      .save(updatedChallenge)
    console.info(`User Profile - challenge ${savedChallenge.id} saved`)

    return savedUserProfile
  }

  public async closeDbConnection() {
    const db = await this.database.getConnection()
    await db.close()
  }
}
