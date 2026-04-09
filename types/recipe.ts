export interface Ingredient {
  amount: string
  unit: string
  item: string
}

export interface Recipe {
  id: string
  title: string
  description: string | null
  categories: string[]
  ingredients: Ingredient[]
  directions: string[]
  estimated_calories: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export type RecipeInsert = Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
export type RecipeUpdate = Partial<RecipeInsert>

export const CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Soup',
  'Salad',
  'Drinks',
  'Sides',
] as const

export type Category = typeof CATEGORIES[number]

export const CATEGORY_LABELS: Record<string, string> = {
  All: 'Alle',
  Breakfast: 'Morgenmad',
  Lunch: 'Frokost',
  Dinner: 'Aftensmad',
  Snack: 'Snack',
  Dessert: 'Dessert',
  Soup: 'Suppe',
  Salad: 'Salat',
  Drinks: 'Drikkevarer',
  Sides: 'Tilbehør',
}
