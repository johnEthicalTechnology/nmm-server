import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import Recipe from './Recipe'

@Entity()
export default class RecipeAttribution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  website: string

  @Column()
  email: string

  @OneToMany(
    () => Recipe,
    recipe => recipe.recipeAttribution
  )
  recipes: Recipe[]

  @Column()
  facebook: string

  @Column()
  instagram: string

  @Column()
  twitter: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
