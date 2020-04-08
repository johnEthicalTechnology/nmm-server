import 'reflect-metadata'

import { container } from '../../inversify.config'
import { TYPES } from '../../inversifyTypes'
import { ICalculatePoints } from '../../types'
import { ChallengeDifficultyEnum } from '../../graphql/types'

const calculatePoints = container.get<ICalculatePoints>(TYPES.CalculatePoints)

import {
  mockMaxUserProfileInput,
  mockMinUserProfileInput,
  mockMaxTotalPoints,
  mockPartialCompletionRecipeChallenge,
  mockCompletionRecipeChallenge
} from '../../testUtils/testMocks'

describe('CalculatePoints class', () => {
  describe('For [USER PROFILE CHALLENGE]', () => {
    describe('Given a [VALID] challenge type', () => {
      it('RETURNS - partial points for [PARTIAL COMPLETION]', () => {
        const calculatedPoints = calculatePoints.calculate(
          mockMinUserProfileInput,
          'createOrUpdateUserProfile'
        )
        const mockPartialTotalPoints = 40

        expect(calculatedPoints).toEqual(mockPartialTotalPoints)
      })

      it('RETURNS - full points for [COMPLETE] user profile', () => {
        const calculatedPoints = calculatePoints.calculate(
          mockMaxUserProfileInput,
          'createOrUpdateUserProfile'
        )

        expect(calculatedPoints).toEqual(mockMaxTotalPoints)
      })
    })
    // TODO - figure out why this test is failing at the throw new Error is the class
    // even though it is throwing the error.
    describe('For [USER PROFILE CHALLENGE] is given [EMPTY] challenge type [ERROR]', () => {
      it('RETURNS - No challengeType provided!', () => {
        const error = calculatePoints.calculate(mockMinUserProfileInput, '')
        expect(error).toEqual('Error: No challengeType provided!')
      })
    })
  })

  describe('For [RECIPE CHALLENGE]', () => {
    describe('Given [VALID] challenge type', () => {
      describe('For different [DIFFICULTY] levels', () => {
        const mockPartialTotalPoints = 10
        const mediumDifficultyMultiplier = 1.15
        const hardDifficultyMultiplier = 1.3
        describe('When [PARTIALLY COMPLETED]', () => {
          it('RETURNS - partial points at [EASY]', () => {
            const calculatedPoints = calculatePoints.calculate(
              mockPartialCompletionRecipeChallenge,
              mockPartialCompletionRecipeChallenge.type
            )

            expect(calculatedPoints).toEqual(mockPartialTotalPoints)
          })
          it('RETURNS - partial points at [MEDIUM]', () => {
            mockPartialCompletionRecipeChallenge.difficulty =
              ChallengeDifficultyEnum.Medium
            const calculatedPoints = calculatePoints.calculate(
              mockPartialCompletionRecipeChallenge,
              mockPartialCompletionRecipeChallenge.type
            )

            expect(calculatedPoints).toEqual(
              mockPartialTotalPoints * mediumDifficultyMultiplier
            )
          })
          it('RETURNS - partial points at [HARD]', () => {
            mockPartialCompletionRecipeChallenge.difficulty =
              ChallengeDifficultyEnum.Hard
            const calculatedPoints = calculatePoints.calculate(
              mockPartialCompletionRecipeChallenge,
              mockPartialCompletionRecipeChallenge.type
            )

            expect(calculatedPoints).toEqual(
              mockPartialTotalPoints * hardDifficultyMultiplier
            )
          })
        })
        describe('When [COMPLETED]', () => {
          // 10 per section * 4
          const mockCompleteTotalPoints = 40
          // 25 for full completion
          const bonusPointsComplete = 25
          it('RETURNS - full points at [EASY]', () => {
            const calculatedPoints = calculatePoints.calculate(
              mockCompletionRecipeChallenge,
              mockCompletionRecipeChallenge.type
            )

            const total = mockCompleteTotalPoints + bonusPointsComplete

            expect(calculatedPoints).toEqual(total)
          })
          it('RETURNS - full points at [MEDIUM]', () => {
            mockCompletionRecipeChallenge.difficulty =
              ChallengeDifficultyEnum.Medium
            const calculatedPoints = calculatePoints.calculate(
              mockCompletionRecipeChallenge,
              mockCompletionRecipeChallenge.type
            )
            const sumTotal =
              mockCompleteTotalPoints * mediumDifficultyMultiplier
            const total = sumTotal + bonusPointsComplete
            expect(calculatedPoints).toEqual(total)
          })
          it('RETURNS - full points at [HARD]', () => {
            mockCompletionRecipeChallenge.difficulty =
              ChallengeDifficultyEnum.Hard
            const calculatedPoints = calculatePoints.calculate(
              mockCompletionRecipeChallenge,
              mockCompletionRecipeChallenge.type
            )
            const sumTotal = mockCompleteTotalPoints * hardDifficultyMultiplier
            const total = sumTotal + bonusPointsComplete

            expect(calculatedPoints).toEqual(total)
          })
        })
      })
    })
  })
})
