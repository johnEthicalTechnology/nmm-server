import { Seeder, Factory } from 'typeorm-seeding'

import UserProfile from '../entities/UserProfile'

export default class createOrUpdateUserProfile implements Seeder {
  public async run(factory: Factory): Promise<any> {
    await factory(UserProfile)().seed()
  }
}
