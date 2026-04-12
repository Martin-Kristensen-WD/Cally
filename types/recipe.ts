export interface Ingredient {
  amount: string
  unit: string
  item: string
}

export interface Recipe {
  id: string
  title: string
  description: string | null
  meal_types: string[]
  dish_type: string | null
  ingredients: Ingredient[]
  directions: string[]
  servings: number | null
  estimated_calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type RecipeInsert = Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
export type RecipeUpdate = Partial<RecipeInsert>

export const MEAL_TYPES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
] as const

export type MealType = typeof MEAL_TYPES[number]

export const MEAL_TYPE_LABELS: Record<string, string> = {
  All: 'Alle',
  Breakfast: 'Morgenmad',
  Lunch: 'Frokost',
  Dinner: 'Aftensmad',
  Snack: 'Snack',
  Dessert: 'Dessert',
}

export const DISH_TYPES = [
  'Soup',
  'Salad',
  'Smoothie',
  'Pasta',
  'Bowl',
  'Sandwich',
  'Baked',
  'Drink',
  'Side',
  'Stew',
] as const

export type DishType = typeof DISH_TYPES[number]

export const DISH_TYPE_LABELS: Record<string, string> = {
  Soup: 'Suppe',
  Salad: 'Salat',
  Smoothie: 'Smoothie',
  Pasta: 'Pasta',
  Bowl: 'Bowl',
  Sandwich: 'Sandwich',
  Baked: 'Bagværk',
  Drink: 'Drik',
  Side: 'Tilbehør',
  Stew: 'Gryderet',
}
