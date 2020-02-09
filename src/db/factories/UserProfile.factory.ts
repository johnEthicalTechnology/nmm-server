import { define } from 'typeorm-seeding'
import * as Faker from 'faker'

import UserProfile from '../entities/UserProfile'
import { MotivationsEnum } from '../../graphql/types'

define(UserProfile, (faker: typeof Faker) => {
  const id = faker.random.alphaNumeric(11)
  const username = faker.fake('{{name.firstName}} {{name.lastName}}')
  const bio = faker.lorem.paragraph(1)
  const lowResProfile = faker.image.cats(320, 320)
  const standardResolituon = faker.image.cats(640, 640)
  const challengeQuote = faker.lorem.sentence()

  const userProfile = new UserProfile()
  userProfile.id = id
  userProfile.totalPoints = 95 // total amount of points for filling complete profile
  userProfile.challengeGoals = 5 // challenging themselves to make 5 recipes per week
  userProfile.motivations = [
    MotivationsEnum.AnimalWelfare,
    MotivationsEnum.Environment
  ]
  userProfile.username = username
  userProfile.bio = bio
  userProfile.lowResProfile = lowResProfile
  userProfile.standardResolution = standardResolituon
  userProfile.challengeQuote = challengeQuote

  return userProfile
})
