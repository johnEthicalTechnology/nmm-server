import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import Recipe from './Recipe'
import UserProfile from './UserProfile'

export enum ChallengeDifficultyEnum {
  Easy = 1,
  Medium = 1.15,
  Hard = 1.3
}

export enum TypeEnum {
  Recipe = 'Recipe',
  Article = 'Article',
  UserProfile = 'UserProfile'
}

export enum SectionsCompletedEnum {
  None = 'None',
  Ingredients = 'Ingredients',
  Method = 'Method',
  SharedFriendsImage = 'SharedFriendsImage',
  SharedRecipe = 'SharedRecipe',
  ReadArticle = 'ReadArticle',
  SharedArticle = 'SharedArticle',
  Motivations = 'Motivations',
  ChallengeGoals = 'ChallengeGoals',
  Username = 'Username',
  Bio = 'Bio',
  LowResProfile = 'LowResProfile',
  ChallengeQuote = 'ChallengeQuote'
}

@Entity()
export default class Challenge {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.Recipe
  })
  type: TypeEnum

  @Column({
    type: 'enum',
    enum: ChallengeDifficultyEnum,
    default: ChallengeDifficultyEnum.Easy
  })
  difficulty: ChallengeDifficultyEnum

  @Column({ nullable: true, default: 0 })
  maxAwardablePoints: number

  @Column({ nullable: true, default: 0 })
  awardedPoints: number

  @Column({ nullable: true })
  maxSectionsCompletable: number

  @Column({
    type: 'enum',
    array: true,
    default: '{None}',
    enum: SectionsCompletedEnum
  })
  sectionsCompleted: SectionsCompletedEnum[]

  @Column({
    type: 'simple-json',
    nullable: true
  })
  sharedFriendsImages: {
    lowResSharedFriendsImage: string
    standardResolution: string
  }

  @Column('int', { nullable: true })
  recipeId: number

  @ManyToOne(() => Recipe, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe

  @Column({ nullable: true })
  userProfileId: string

  @ManyToOne(
    () => UserProfile,
    userProfile => userProfile.challenges,
    {
      cascade: true,
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({ name: 'userProfileId' })
  userProfile: UserProfile

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
