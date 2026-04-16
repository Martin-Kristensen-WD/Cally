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
  time_estimate: string | null
  ingredients: Ingredient[]
  directions: string[]
  servings: number | null
  estimated_calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  serving_label: string | null
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

export const TIME_ESTIMATES = [
  'under_5',
  '5_10',
  '15_30',
  '30_45',
  '45_60',
  'over_60',
] as const

export type TimeEstimate = typeof TIME_ESTIMATES[number]

export const TIME_ESTIMATE_LABELS: Record<string, string> = {
  under_5: 'Under 5 min',
  '5_10': '5–10 min',
  '15_30': '15–30 min',
  '30_45': '30–45 min',
  '45_60': '45–60 min',
  over_60: 'Over 1 time',
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
  'Asian',
  'Mexican',
  'Indian',
  'Burger',
  'Pizza',
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
  Asian: 'Asiatisk',
  Mexican: 'Mexikansk',
  Indian: 'Indisk',
  Burger: 'Burger',
  Pizza: 'Pizza',
}
