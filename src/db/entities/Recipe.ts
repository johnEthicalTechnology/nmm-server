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

const roleTransformer = {
  to: (arrayOfStrings: string[]): string =>
    `{"${arrayOfStrings.filter(string => string).join('","')}"}`,
  from: (postgresArray: any): string[] => postgresArray
}

@Entity()
export default class Recipe {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({
    type: 'text',
    nullable: false,
    array: true,
    transformer: roleTransformer
  })
  ingredients: string[]

  @Column({
    type: 'text',
    nullable: false,
    array: true,
    transformer: roleTransformer
  })
  method: string[]

  @Column({
    type: 'text',
    nullable: false,
    array: true,
    transformer: roleTransformer
  })
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

  @Column({ nullable: true })
  videoUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
