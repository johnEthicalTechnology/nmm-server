import { define } from 'typeorm-seeding'
import * as Faker from 'faker'

import Recipe from '../entities/Recipe'
import { DifficultyEnum, CostEnum, MealTypeEnum } from '../entities/Recipe'

define(Recipe, (faker: typeof Faker) => {
  const mealTypeArr = [
    MealTypeEnum.Breakfast,
    MealTypeEnum.Lunch,
    MealTypeEnum.Snack,
    MealTypeEnum.Dinner
  ]
  const difficultyArr = [
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard
  ]
  const costArr = [CostEnum.Budget, CostEnum.Expensive, CostEnum.Moderate]

  const title = faker.lorem.words(2)
  let ingredients = []
  for (let index = 0; index < 5; index++)
    ingredients.push(faker.lorem.sentence())
  let method = []
  for (let index = 0; index < 5; index++) method.push(faker.lorem.sentence())
  const randomMealType: MealTypeEnum = faker.random.arrayElement(mealTypeArr)
  const randomDifficulty: DifficultyEnum = faker.random.arrayElement(
    difficultyArr
  )
  const randomCost: CostEnum = faker.random.arrayElement(costArr)

  const recipe = new Recipe()
  recipe.title = title
  recipe.ingredients = ingredients
  recipe.method = method
  recipe.hashtags = [
    '#theclumsyvegan',
    '#meatballs',
    '#spaghetti',
    '#nomeatmay'
  ]
  recipe.lowResolution = faker.image.food(320, 320)
  recipe.standardResolution = faker.image.food(640, 640)
  recipe.mealType = randomMealType
  recipe.difficulty = randomDifficulty
  recipe.cost = randomCost

  return recipe
})
