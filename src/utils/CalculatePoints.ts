import { inject, injectable } from 'inversify'
import { TYPES } from '../inversifyTypes'

import { LambdaLog } from 'lambda-log'

import { ILogger, ICalculatePoints } from '../types'
import { ChallengeInput, UserProfileInput } from '../graphql/types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly logger: LambdaLog

  private readonly POINTS_PER_SECTION_COMPLETED = 10
  private readonly ALL_SECTIONS_COMPLETED_BONUS = 25
  public constructor(@inject(TYPES.Logger) Logger: ILogger) {
    this.logger = Logger.getLogger()
  }

  /**
   * Returns sum total of points for completed user profile items
   *
   * @remarks
   * Each item for UserProfileInput is worth 10 points. There are 7
   * in total. If all are completed the user is rewarded an extra 25 points.
   * Only completed items pass through. Which is why I'm not using
   * default value for the arguments of the userProfile class.
   *
   * @param userProfile - a UserProfileInput object
   * @param currentSumTotalPoints - how many points on a user's profile
   * @returns sumTotalPoints - new sum total of points
   */
  private calculateUserProfilePoints(
    userProfile: UserProfileInput,
    currentSumTotalPoints: number
  ) {
    const MAX_COMPLETABLE_ITEMS = 7

    const completedSections = Object.keys(userProfile).length
    const sectionsCompletedSumTotal =
      completedSections * this.POINTS_PER_SECTION_COMPLETED
    let sumTotalPoints = currentSumTotalPoints + sectionsCompletedSumTotal

    if (completedSections == MAX_COMPLETABLE_ITEMS)
      sumTotalPoints += this.ALL_SECTIONS_COMPLETED_BONUS

    return Math.floor(sumTotalPoints)
  }

  /**
   * Returns sum total of points for completed recipe challenge sections
   *
   * @remarks
   * Each section in sectionsCompleted[] is worth 10 points. There are 4
   * in total. The sectionsCompletedSumTotal is multiplied by the difficultly level.
   * They are 1, 1.15, 1.30.
   * If all are completed the user is rewarded an extra 25 points.
   *
   * @param { sectionsCompleted, difficultly } - ChallengeInput object
   * @returns sumTotalPoints - new sum total of points
   */
  private calculateRecipeChallengePoints({
    sectionsCompleted,
    difficulty
  }: ChallengeInput) {
    const MAX_COMPLETABLE_ITEMS = 4

    const completedSections = sectionsCompleted.length
    let sectionsCompletedSumTotal =
      completedSections *
      this.POINTS_PER_SECTION_COMPLETED *
      ((difficulty as unknown) as number)

    if (completedSections == MAX_COMPLETABLE_ITEMS)
      sectionsCompletedSumTotal += this.ALL_SECTIONS_COMPLETED_BONUS

    return Math.floor(sectionsCompletedSumTotal)
  }

  public calculate(
    challengeObject: any,
    challengeType: string,
    currentSumTotalPoints = 0
  ): number {
    if (!challengeType) throw new Error('No challengeType provided!')
    let sumTotalPoints
    switch (challengeType) {
      case 'createUserProfile' || 'updateProfile':
        this.logger.info(
          `Calculating points for user profile items: ${JSON.stringify(
            challengeObject
          )}`
        )
        sumTotalPoints = this.calculateUserProfilePoints(
          challengeObject,
          currentSumTotalPoints
        )
        this.logger.info(`Calculated points: ${sumTotalPoints}`)
        return sumTotalPoints
      case 'Recipe':
        this.logger.info(
          `Calculating points for recipe challenge with items:
            ${challengeObject.sectionsCompleted.toString()}`
        )
        sumTotalPoints = this.calculateRecipeChallengePoints(challengeObject)
        this.logger.info(`Calculated points: ${sumTotalPoints}`)
        return sumTotalPoints
      default:
        return 100
    }
  }
}
