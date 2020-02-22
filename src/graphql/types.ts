export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: number | string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Article = {
   __typename?: 'Article',
  id: Scalars['ID'],
  title: Scalars['String'],
  content: Scalars['String'],
  hashtag: Array<Scalars['String']>,
  type: Scalars['String'],
};

export type Challenge = {
   __typename?: 'Challenge',
  id: Scalars['ID'],
  type: TypeEnum,
  difficulty: ChallengeDifficultyEnum,
  maxAwardablePoints?: Maybe<Scalars['Int']>,
  awardedPoints?: Maybe<Scalars['Int']>,
  maxSectionsCompletable?: Maybe<Scalars['Int']>,
  sectionsCompleted: Array<SectionsCompletedEnum>,
  sharedFriendsImages?: Maybe<SharedFriendsImage>,
  userProfileId?: Maybe<Scalars['String']>,
  recipeId?: Maybe<Scalars['Int']>,
};

export enum ChallengeDifficultyEnum {
  Easy = '1',
  Medium = '1.15',
  Hard = '1.3'
}

export type ChallengeInput = {
  type: TypeEnum,
  sectionsCompleted: Array<SectionsCompletedEnum>,
  difficulty: ChallengeDifficultyEnum,
  lowResSharedFriendsImage?: Maybe<Scalars['String']>,
  standardResolution?: Maybe<Scalars['String']>,
  recipeId: Scalars['Int'],
};

export enum CostEnum {
  Budget = 'Budget',
  Moderate = 'Moderate',
  Expensive = 'Expensive'
}

export type CreateArticle = {
  title: Scalars['String'],
  content: Scalars['String'],
  hashtag: Array<Scalars['String']>,
  type: Scalars['String'],
};

export enum DifficultyEnum {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export enum MealTypeEnum {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack'
}

export enum MotivationsEnum {
  Environment = 'Environment',
  AnimalWelfare = 'AnimalWelfare',
  FoodSecurity = 'FoodSecurity',
  PersonalHealth = 'PersonalHealth'
}

export type Mutation = {
   __typename?: 'Mutation',
  createUserProfile?: Maybe<UserProfile>,
  createRecipe?: Maybe<Recipe>,
  deleteRecipe?: Maybe<Recipe>,
  createOrUpdateChallenge?: Maybe<Challenge>,
};

export type MutationCreateUserProfileArgs = {
  userProfileInput?: Maybe<UserProfileInput>
};


export type MutationCreateRecipeArgs = {
  recipe?: Maybe<RecipeInput>
};


export type MutationDeleteRecipeArgs = {
  deleteSecret: Scalars['String'],
  recipeId?: Maybe<Scalars['Int']>,
  recipeTitle?: Maybe<Scalars['String']>
};


export type MutationCreateOrUpdateChallengeArgs = {
  challengeInput?: Maybe<ChallengeInput>
};

export type Query = {
   __typename?: 'Query',
  challenge?: Maybe<Challenge>,
  recipes: Array<Maybe<Recipe>>,
  recipe: Recipe,
  me?: Maybe<UserProfile>,
};


export type QueryChallengeArgs = {
  recipeId: Scalars['ID']
};


export type QueryRecipeArgs = {
  recipeId?: Maybe<Scalars['ID']>,
  recipeTitle?: Maybe<Scalars['String']>
};


export type QueryMeArgs = {
  id: Scalars['String']
};

export type Recipe = {
   __typename?: 'Recipe',
  /** **LIST && SHOW** */
  id?: Maybe<Scalars['ID']>,
  title: Scalars['String'],
  difficulty: DifficultyEnum,
  cost: CostEnum,
  mealType: MealTypeEnum,
  hashtags: Array<Scalars['String']>,
  /** **LIST** */
  lowResolution: Scalars['String'],
  /** **SHOW** */
  recipeAttribution?: Maybe<RecipeAttribution>,
  ingredients: Array<Scalars['String']>,
  method: Array<Scalars['String']>,
  standardResolution: Scalars['String'],
};

export type RecipeAttribution = {
   __typename?: 'RecipeAttribution',
  id?: Maybe<Scalars['ID']>,
  name?: Maybe<Scalars['String']>,
  website?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  facebook?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
};

export type RecipeInput = {
  title: Scalars['String'],
  email: Scalars['String'],
  name: Scalars['String'],
  ingredients: Array<Scalars['String']>,
  method: Array<Scalars['String']>,
  hashtags: Array<Scalars['String']>,
  difficulty: DifficultyEnum,
  cost: CostEnum,
  mealType: MealTypeEnum,
  lowResolution: Scalars['String'],
  standardResolution: Scalars['String'],
  website?: Maybe<Scalars['String']>,
  facebook?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
};

export enum SectionsCompletedEnum {
  None = 'None',
  Ingredients = 'Ingredients',
  Method = 'Method',
  SharedFriendsImage = 'SharedFriendsImage',
  SharedRecipe = 'SharedRecipe',
  ReadArticle = 'ReadArticle',
  SharedArticle = 'SharedArticle'
}

export type SharedFriendsImage = {
   __typename?: 'SharedFriendsImage',
  lowResSharedFriendsImage?: Maybe<Scalars['String']>,
  standardResolution?: Maybe<Scalars['String']>,
};

export enum TypeEnum {
  Recipe = 'Recipe',
  Article = 'Article'
}

export type UserProfile = {
   __typename?: 'UserProfile',
  id?: Maybe<Scalars['ID']>,
  totalPoints: Scalars['Int'],
  challengeGoals: Scalars['Int'],
  motivations: Array<MotivationsEnum>,
  username: Scalars['String'],
  bio?: Maybe<Scalars['String']>,
  lowResProfile?: Maybe<Scalars['String']>,
  standardResolution?: Maybe<Scalars['String']>,
  challengeQuote?: Maybe<Scalars['String']>,
};

export type UserProfileInput = {
  id: Scalars['ID'],
  challengeGoals: Scalars['Int'],
  motivations: Array<MotivationsEnum>,
  username: Scalars['String'],
  bio?: Maybe<Scalars['String']>,
  lowResProfile?: Maybe<Scalars['String']>,
  standardResolution?: Maybe<Scalars['String']>,
  challengeQuote?: Maybe<Scalars['String']>,
};
