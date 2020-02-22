import { injectable, inject } from 'inversify'
// DB Entities
import UserProfileEntity from '../../db/entities/UserProfile'
// TYPES
import { UserProfileInput } from '../types'
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

  public async findUserProfile(verifiedUserId: string) {
    const db = await this.database.getConnection()
    const userProfile = await db.getRepository(UserProfileEntity).findOne({
      where: {
        id: verifiedUserId
      }
    })

    return userProfile
  }

  public async createUserProfile(
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

    // TODO - make sure they their point's aren't reset when
    // they update their profile or they don't cheat and just continually
    // update their profile to get points.
    const calculatedPoints = this.calculatePoints.calculate(
      userProfileInput,
      challengeType
    )
    // TODO - fix up so if user updates their profile later they'll get
    // points for completing it
    let userProfile = new UserProfileEntity()
    userProfile.id = id as string
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

    userProfile.totalPoints = calculatedPoints as number

    const savedUserProfile = await db
      .getRepository(UserProfileEntity)
      .save(userProfile)

    return savedUserProfile
  }

  public async closeDbConnection() {
    const db = await this.database.getConnection()
    await db.close()
  }
}
