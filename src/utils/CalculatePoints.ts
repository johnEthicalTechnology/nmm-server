import { injectable } from 'inversify'

import ChallengeEntity from '../db/entities/Challenge'
import { ICalculatePoints } from '../types'
import {
  ChallengeInput,
  UserProfileInput,
  SectionsCompletedEnum,
  TypeEnum
} from '../graphql/types'

@injectable()
export default class CalculatePoints implements ICalculatePoints {
  private readonly POINTS_PER_SECTION_COMPLETED = 10
  private readonly ALL_SECTIONS_COMPLETED_BONUS = 25
  public constructor() {}

  /**
   * @remarks
   * This is to determine which sections have been completed for the current
   * challenge and add the unique currently completed sections to the
   *  sections that have already been completed in the challenge
   *
   * @param sectionsCompleted
   * @param sectionsJustCompleted
   * @return { currentSectionsCompleted, totalSectionsCompleted }
   */
  private checkSectionsAndMergeCompletedSections(
    sectionsCompleted: Array<SectionsCompletedEnum>,
    sectionsJustCompleted: Array<SectionsCompletedEnum>
  ): {
    totalSectionsCompleted: Array<SectionsCompletedEnum>
    currentSectionsCompleted: Array<SectionsCompletedEnum>
  } {
    console.log('totalSectionsCompleted', sectionsCompleted)
    console.log('currentSectionsCompleted', sectionsJustCompleted)

    const VALUE_NOT_PRESENT = -1
    // Find sections not completed
    const currentSectionsCompleted = sectionsJustCompleted.filter(
      section => VALUE_NOT_PRESENT === sectionsCompleted.indexOf(section)
    )
    // Combine sections just completed and previously completed sections
    const totalSectionsCompleted = sectionsCompleted.concat(
      currentSectionsCompleted
    )

    return {
      totalSectionsCompleted,
      currentSectionsCompleted
    }
  }
  /**
   * @remarks
   * This is to create the appropriate data type for the sectionsCompleted
   * property in the challenge entity
   *
   * @param section - a key from the user profile input
   * @returns SectionsCompletedEnum - a key from the enum
   */
  private addSection(section: string) {
    console.log('section', section)

    switch (section) {
      case 'motivations':
        return SectionsCompletedEnum.Motivations
      case 'challengeGoals':
        return SectionsCompletedEnum.ChallengeGoals
      case 'username':
        return SectionsCompletedEnum.Username
      case 'bio':
        return SectionsCompletedEnum.Bio
      case 'lowResProfile':
        return SectionsCompletedEnum.LowResProfile
      case 'challengeQuote':
        return SectionsCompletedEnum.ChallengeQuote
      default:
        return SectionsCompletedEnum.None
    }
  }

  /**
   * @remarks
   * Each item for UserProfileInput is worth 10 points. There are 7
   * in total. If all are completed the user is rewarded an extra 25 points.
   * Only completed items pass through. Which is why I'm not using
   * default value for the arguments of the userProfile class.
   *
   * The 6 completeable items are:
   * - challengeGoals (required)
   * - username (required)
   * - motivations (required)
   * - bio
   * - lowResProfile
   * - challengeQuote
   *
   * @param userProfile - a UserProfileInput object
   * @param challenge - challenge entity
   * @returns { updatedChallenge: ChallengeEntity, amountToAddToUserProfile: number }
   */
  private calculateUserProfilePoints(
    userProfile: UserProfileInput,
    challenge: ChallengeEntity
  ) {
    const MAX_COMPLETABLE_ITEMS = 6
    const maxAwardablePoints =
      MAX_COMPLETABLE_ITEMS * this.POINTS_PER_SECTION_COMPLETED +
      this.ALL_SECTIONS_COMPLETED_BONUS
    const sectionsArray = Object.keys(userProfile)
    // Map user profile sections to Enum keys
    const sectionsJustCompleted: Array<SectionsCompletedEnum> = sectionsArray.map(
      (section: string) => {
        return this.addSection(section)
      }
    )

    const {
      totalSectionsCompleted,
      currentSectionsCompleted
    } = this.checkSectionsAndMergeCompletedSections(
      challenge.sectionsCompleted,
      sectionsJustCompleted
    )

    console.log('currentSectionsCompleted', currentSectionsCompleted)
    console.log('totalSectionsCompleted', totalSectionsCompleted)

    // Calculate points for current sections
    const totalCompletedSections = totalSectionsCompleted.length
    const completedSections = currentSectionsCompleted.length

    let sectionsCompletedSumTotal =
      completedSections * this.POINTS_PER_SECTION_COMPLETED
    if (totalCompletedSections == MAX_COMPLETABLE_ITEMS)
      sectionsCompletedSumTotal += this.ALL_SECTIONS_COMPLETED_BONUS
    const awardedPoints = Math.floor(sectionsCompletedSumTotal)

    // Update/Add challenge sections
    challenge.sectionsCompleted = totalSectionsCompleted
    challenge.maxSectionsCompletable = MAX_COMPLETABLE_ITEMS
    challenge.maxAwardablePoints = maxAwardablePoints
    challenge.awardedPoints += awardedPoints
    if (maxAwardablePoints === challenge.awardedPoints)
      challenge.completed = true

    return {
      updatedChallenge: challenge,
      amountToAddToUserProfile: awardedPoints
    }
  }

  /**
   * @remarks
   * Each section in sectionsCompleted[] is worth 10 points. There are 4
   * in total. The sectionsCompletedSumTotal is multiplied by the difficultly level.
   * They are 1, 1.15, 1.30.
   * If all are completed the user is rewarded an extra 25 points.
   * The 4 completeable items are:
   * - Ingredients
   * - Method
   * - SharedFriendsImage
   * - SharedRecipe
   *
   * @param { sectionsCompleted, difficultly } - ChallengeInput object
   * @param challenge - challenge entity
   * @returns { updatedChallenge: ChallengeEntity, amountToAddToUserProfile: number }
  }
   */
  private calculateRecipeChallengePoints(
    { sectionsCompleted, difficulty }: ChallengeInput,
    challenge: ChallengeEntity
  ) {
    const MAX_COMPLETABLE_ITEMS = 4
    const difficultyAsNumber = (difficulty as unknown) as number
    const maxAwardablePoints =
      (MAX_COMPLETABLE_ITEMS * this.POINTS_PER_SECTION_COMPLETED +
        this.ALL_SECTIONS_COMPLETED_BONUS) *
      difficultyAsNumber

    const {
      totalSectionsCompleted,
      currentSectionsCompleted
    } = this.checkSectionsAndMergeCompletedSections(
      challenge.sectionsCompleted,
      sectionsCompleted
    )

    // calculate points
    const totalCompletedSections = totalSectionsCompleted.length
    const completedSections = currentSectionsCompleted.length
    let sectionsCompletedSumTotal =
      completedSections * this.POINTS_PER_SECTION_COMPLETED * difficultyAsNumber
    if (totalCompletedSections == MAX_COMPLETABLE_ITEMS)
      sectionsCompletedSumTotal += this.ALL_SECTIONS_COMPLETED_BONUS
    const awardedPoints = Math.floor(sectionsCompletedSumTotal)

    // Update/Add challenge sections
    challenge.difficulty = difficulty
    challenge.sectionsCompleted = totalSectionsCompleted
    challenge.maxSectionsCompletable = MAX_COMPLETABLE_ITEMS
    challenge.maxAwardablePoints = maxAwardablePoints
    challenge.awardedPoints += awardedPoints
    if (maxAwardablePoints === challenge.awardedPoints)
      challenge.completed = true

    return {
      updatedChallenge: challenge,
      amountToAddToUserProfile: awardedPoints
    }
  }

  public calculate(
    challengeObject: any,
    challenge: ChallengeEntity,
    challengeType: string
  ): {
    updatedChallenge: ChallengeEntity
    amountToAddToUserProfile: number
  } {
    if (!challengeType) throw new Error('No challengeType provided!')
    let result
    switch (challengeType) {
      case 'UserProfile':
        console.info(
          `Calculating points for user profile items: ${JSON.stringify(
            challengeObject
          )}`
        )
        challenge.type = TypeEnum.UserProfile
        delete challengeObject.id
        delete challengeObject.standardResolution
        result = this.calculateUserProfilePoints(challengeObject, challenge)
        console.info(
          `Calculated points: ${result.updatedChallenge.awardedPoints}`
        )
        return result
      case 'Recipe':
        console.info(`Calculating points for recipe challenge with items:
        ${challengeObject.sectionsCompleted.toString()}`)
        challenge.type = TypeEnum.Recipe
        result = this.calculateRecipeChallengePoints(challengeObject, challenge)
        console.info(
          `Calculated points: ${result.updatedChallenge.awardedPoints}`
        )
        return result
      default:
        throw new Error('No challenge type passed through! Try again!')
    }
  }
}
