import { injectable, inject } from 'inversify'
// import { container } from '../../inversify.config'
// DB Entities
import ChallengeEntity, {
  SectionsCompletedEnum
} from '../../db/entities/Challenge'
import UserProfileEntity from '../../db/entities/UserProfile'
import RecipeEntity from '../../db/entities/Recipe'

// TYPES
import { ChallengeInput, TypeEnum } from '../types'
import { TYPES } from '../../inversifyTypes'
import {
  ILogger,
  IChallengeAPI,
  IDatabase,
  ICalculatePoints
} from '../../types'

import { DataSourceConfig } from 'apollo-datasource'

@injectable()
export default class ChallengeAPI implements IChallengeAPI {
  private readonly calculatePoints: ICalculatePoints
  private readonly logger: ILogger
  private readonly database: IDatabase
  private context: any

  public constructor(
    @inject(TYPES.CalculatePoints) calculatePoints: ICalculatePoints,
    @inject(TYPES.Logger) Logger: ILogger,
    @inject(TYPES.Database) database: IDatabase
  ) {
    this.calculatePoints = calculatePoints
    this.logger = Logger
    this.database = database
  }

  public async initialize(config: DataSourceConfig<any>) {
    this.context = config.context
  }

  /**
   * findChallenge
   */
  public async findChallenge(recipeId: number, userProfileId: string) {
    const db = await this.database.getConnection()
    const challenge = await db.getRepository(ChallengeEntity).findOne({
      recipeId,
      userProfileId
    })

    return challenge
  }

  public async createOrUpdateChallenge(
    challengeInput: ChallengeInput,
    challengeType: TypeEnum,
    verifiedUser: string
  ) {
    const {
      type,
      lowResSharedFriendsImage,
      standardResolution,
      recipeId
    } = challengeInput
    const db = await this.database.getConnection()

    // * 1. Check if challenge exists
    let challenge: ChallengeEntity | undefined
    challenge = await db
      .getRepository(ChallengeEntity)
      .findOne({ userProfileId: verifiedUser, recipeId })
    // * 1.a. Chek if challenge doesn't exist, create new challenge
    if (typeof challenge === 'undefined') {
      console.info(`Challenge is ${challenge} - creating new challenge`)
      challenge = new ChallengeEntity()
      challenge.sectionsCompleted = []
      challenge.awardedPoints = 0
    }
    // * 1.b. Check if challenge is complete, if complete return Challenge
    if (challenge.completed) return challenge

    // * 2. Update challenge entity and calc points
    let sharedFriendsImages = {
      lowResSharedFriendsImage: '',
      standardResolution: ''
    }
    if (typeof lowResSharedFriendsImage == 'string') {
      sharedFriendsImages.lowResSharedFriendsImage = lowResSharedFriendsImage
      challenge.sharedFriendsImages = sharedFriendsImages
    }
    if (typeof standardResolution == 'string') {
      sharedFriendsImages.standardResolution = standardResolution
      challenge.sharedFriendsImages = sharedFriendsImages
    }
    const {
      updatedChallenge,
      amountToAddToUserProfile
    } = this.calculatePoints.calculate(challengeInput, challenge, challengeType)
    const recipe = await db.getRepository(RecipeEntity).findOne(recipeId)
    if (typeof recipe !== 'undefined') updatedChallenge.recipe = recipe
    else {
      console.error('Challenge - could not find recipe to add to challenge')
      throw new Error(
        'Challenge - could not find recipe to add to challenge. Try again!'
      )
    }

    // * 3. Update user profile total points
    const ERROR_NO_AFFECTED_ROWS = 0
    const updatedUserProfile = await db
      .getRepository(UserProfileEntity)
      .increment({ id: verifiedUser }, 'totalPoints', amountToAddToUserProfile)
    if (updatedUserProfile.affected == ERROR_NO_AFFECTED_ROWS) {
      console.error(
        `UserProfile totalPoints not updated: ${JSON.stringify(
          updatedUserProfile
        )}`
      )
      throw new Error(
        'Challenge - UserProfile totalPoints not updated. Try again!'
      )
    }

    // * 4. Save & Return challenge
    const savedChallenge = await db
      .getRepository(ChallengeEntity)
      .save(updatedChallenge)
    // Remove Recipe object from returned object
    // to be compatible with GraphQL return type
    if (type == 'Recipe') delete savedChallenge.recipe

    return savedChallenge
  }

  public async closeDbConnection() {
    const db = await this.database.getConnection()
    await db.close()
  }
}
