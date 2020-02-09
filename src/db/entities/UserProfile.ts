import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'

import Challenge from './Challenge'

enum MotivationsEnum {
  Environment = 'Environment',
  AnimalWelfare = 'AnimalWelfare',
  FoodSecurity = 'FoodSecurity',
  PersonalHealth = 'PersonalHealth'
}

@Entity()
export default class UserProfile {
  @PrimaryColumn()
  id: string

  @Column()
  totalPoints: number

  @Column()
  challengeGoals: number

  @Column()
  username: string

  @Column({
    type: 'enum',
    array: true,
    enum: MotivationsEnum
  })
  motivations: MotivationsEnum[]

  @Column({
    default: 'Fill in your bio for more points!'
  })
  bio: string

  @Column({
    default:
      'https://res.cloudinary.com/codeinaire/image/upload/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  })
  lowResProfile: string

  @Column({
    default:
      'https://res.cloudinary.com/codeinaire/image/upload/c_scale,q_auto,w_640/v1575760488/nmm-profile-pics/y7vzfciewvobndehwe9e.jpg'
  })
  standardResolution: string

  @Column({
    default: 'What is a quote that inspires you to grow?'
  })
  challengeQuote: string

  @OneToMany(
    () => Challenge,
    challenge => challenge.userProfile
  )
  challenges: Challenge[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
