import { define } from 'typeorm-seeding'
import * as Faker from 'faker'

import RecipeAttribution from '../entities/RecipeAttribution'

define(RecipeAttribution, (faker: typeof Faker) => {
  const name = faker.name.findName()
  const website = faker.internet.url()
  const facebook = faker.internet.url()
  const instagram = faker.internet.url()
  const twitter = faker.internet.url()
  const email = faker.internet.email()

  const recipeAttribution = new RecipeAttribution()
  recipeAttribution.name = name
  recipeAttribution.website = website
  recipeAttribution.email = email
  recipeAttribution.instagram = instagram
  recipeAttribution.facebook = facebook
  recipeAttribution.twitter = twitter

  return recipeAttribution
})
