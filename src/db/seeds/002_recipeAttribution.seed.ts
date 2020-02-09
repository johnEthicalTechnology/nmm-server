import { Seeder, Factory } from 'typeorm-seeding'

import RecipeAttribution from '../entities/RecipeAttribution'

export default class CreateRecipeAttribution implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(RecipeAttribution)().seed()
  }
}
