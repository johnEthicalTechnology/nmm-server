import { injectable, inject } from 'inversify'
// import { container } from '../../inversify.config'
// DB Entities
import ChallengeEntity from '../../db/entities/Challenge'
import UserProfileEntity from '../../db/entities/UserProfile'
import RecipeEntity from '../../db/entities/Recipe'
import CompletedChallengeEntity from '../../db/entities/CompletedChallenge'
import UncompletedChallengeEntity from '../../db/entities/UncompletedChallenge'

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
    const MAX_RECIPE_SECTIONS_COMPLETABLE = 4
    const POINTS_PER_SECTION_COMPLETED = 10
    const ALL_SECTIONS_COMPLETED_BONUS = 25
    const {
      type,
      sectionsCompleted,
      difficulty,
      lowResSharedFriendsImage,
      standardResolution,
      recipeId
    } = challengeInput
    const db = await this.database.getConnection()

    // Calculate challenge points, update UserProfileEntity
    // with new total, & get updated UserProfile object
    const calculatedPoints = this.calculatePoints.calculate(
      challengeInput,
      challengeType
    )

    const ERROR_NO_AFFECTED_ROWS = 0
    const updatedUserProfile = await db
      .getRepository(UserProfileEntity)
      .increment({ id: verifiedUser }, 'totalPoints', calculatedPoints)
    if (updatedUserProfile.affected == ERROR_NO_AFFECTED_ROWS) {
      this.logger.getLogger().error('UserProfile totalPoints not updated')
      throw new Error('UserProfile totalPoints not updated. Try again!')
    }

    const updatedUserProfileObject = await db
      .getRepository(UserProfileEntity)
      .findOne(verifiedUser)
    if (updatedUserProfileObject == undefined) {
      this.logger.getLogger().error('UserProfile not found')
      throw new Error('UserProfile not found')
    }

    let challenge: ChallengeEntity | undefined
    challenge = await db
      .getRepository(ChallengeEntity)
      .findOne({ userProfileId: verifiedUser, recipeId })
    // Create/Update ChallengeEntity
    if (challenge == undefined) challenge = new ChallengeEntity()
    challenge.userProfile = updatedUserProfileObject
    challenge.awardedPoints = calculatedPoints
    challenge.type = type
    challenge.difficulty = difficulty
    if (!!sectionsCompleted) challenge.sectionsCompleted = sectionsCompleted
    if (type == 'Recipe') {
      challenge.maxAwardablePoints =
        POINTS_PER_SECTION_COMPLETED * MAX_RECIPE_SECTIONS_COMPLETABLE +
        ALL_SECTIONS_COMPLETED_BONUS
      challenge.maxSectionsCompletable = MAX_RECIPE_SECTIONS_COMPLETABLE
    }

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

    const recipe = await db.getRepository(RecipeEntity).findOne(recipeId)
    if (recipe) challenge.recipe = recipe

    const savedChallenge = await db
      .getRepository(ChallengeEntity)
      .save(challenge)

    // Create/Update Un/CompleteChallengeEntity
    const numberOfSectionsCompleted = sectionsCompleted.length
    if (numberOfSectionsCompleted == MAX_RECIPE_SECTIONS_COMPLETABLE) {
      let completedChallenge = new CompletedChallengeEntity()
      completedChallenge.userProfile = updatedUserProfileObject
      completedChallenge.challenge = savedChallenge
      await db.getRepository(CompletedChallengeEntity).save(completedChallenge)
      // Delete uncompleted entity when challenge complete
      await db
        .getRepository(UncompletedChallengeEntity)
        .delete({ userProfileId: verifiedUser, challengeId: savedChallenge.id })
    } else {
      let uncompletedChallenge = await db
        .getRepository(UncompletedChallengeEntity)
        .findOne({
          userProfileId: verifiedUser,
          challengeId: savedChallenge.id
        })
      if (uncompletedChallenge == undefined) {
        uncompletedChallenge = new UncompletedChallengeEntity()
        uncompletedChallenge.userProfile = updatedUserProfileObject
        uncompletedChallenge.challenge = savedChallenge
        await db
          .getRepository(UncompletedChallengeEntity)
          .save(uncompletedChallenge)
      }
    }
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
