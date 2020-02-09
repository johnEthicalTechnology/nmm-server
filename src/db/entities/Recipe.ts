import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import RecipeAttribution from './RecipeAttribution'

export enum DifficultyEnum {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum CostEnum {
  Budget = 'Budget',
  Moderate = 'Moderate',
  Expensive = 'Expensive'
}

export enum MealTypeEnum {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack'
}

@Entity()
export default class Recipe {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column('simple-array')
  ingredients: string[]

  @Column('simple-array')
  method: string[]

  @Column('simple-array')
  hashtags: string[]

  @Column({
    type: 'enum',
    enum: DifficultyEnum
  })
  difficulty: DifficultyEnum

  @Column({
    type: 'enum',
    enum: CostEnum
  })
  cost: CostEnum

  @Column({
    type: 'enum',
    enum: MealTypeEnum
  })
  mealType: MealTypeEnum

  @Column()
  lowResolution: string

  @Column()
  standardResolution: string

  @Column('int', { nullable: true })
  recipeAttributionId: number

  @ManyToOne(
    () => RecipeAttribution,
    recipeAttribution => recipeAttribution.recipes,
    {
      cascade: true,
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({ name: 'recipeAttributionId' })
  recipeAttribution: RecipeAttribution

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
