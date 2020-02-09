import { Seeder, times, Factory } from 'typeorm-seeding'
import { Connection } from 'typeorm'

import Recipe from '../entities/Recipe'
import RecipeAttribution from '../entities/RecipeAttribution'

export default class CreateRecipes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const db = connection.createEntityManager()
    let count = 0
    const recipeAttributionEven = await factory(RecipeAttribution)().seed()
    await times(15, async () => {
      count++
      // Creates a recipeAttribution in the db
      const recipeAttribution = await factory(RecipeAttribution)().seed()
      // This only returns a entity with fake data
      // with same recipeAttribution or different
      const recipe = await factory(Recipe)().make()
      if (count % 2) recipe.recipeAttribution = recipeAttributionEven
      else recipe.recipeAttribution = recipeAttribution

      await db.save(recipe)
    })
  }
}
