export const MEAL_SLOTS = ['breakfast', 'snack', 'lunch', 'snack2', 'dinner', 'dessert'] as const
export type MealSlot = typeof MEAL_SLOTS[number]

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Morgenmad',
  snack: 'Formiddagssnack',
  lunch: 'Frokost',
  snack2: 'Eftermiddagssnack',
  dinner: 'Aftensmad',
  dessert: 'Dessert',
}

export const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export type WeekDay = typeof WEEK_DAYS[number]

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  monday: 'Mandag',
  tuesday: 'Tirsdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lørdag',
  sunday: 'Søndag',
}

export const WEEK_DAY_SHORT: Record<WeekDay, string> = {
  monday: 'Man',
  tuesday: 'Tir',
  wednesday: 'Ons',
  thursday: 'Tor',
  friday: 'Fre',
  saturday: 'Lør',
  sunday: 'Søn',
}

export interface CustomFood {
  type: 'custom'
  name: string
  calories: number | null
  // Notes/placeholders like "Aftensmad" or "Frokost på kontoret" aren't
  // groceries — exclude them from the generated shopping list.
  excludeFromShoppingList?: boolean
}

export interface FoodItemEntry {
  type: 'food_item'
  food_item_id: string
  // Always in the referenced FoodItem's own unit — entries never convert units.
  amount: number | null
}

// A single dish: a recipe id, a custom food, or a quantified food item.
export type MealEntry = string | CustomFood | FoodItemEntry

export const isCustomFood = (entry: MealEntry): entry is CustomFood =>
  typeof entry === 'object' && entry !== null && entry.type === 'custom'

export const isFoodItemEntry = (entry: MealEntry): entry is FoodItemEntry =>
  typeof entry === 'object' && entry !== null && entry.type === 'food_item'

// meals[day][slot] = one dish, several combined (e.g. eggs + a smoothie), or
// none. Arrays only appear once a slot has 2+ dishes — a single dish is
// still stored as a bare MealEntry for backward compatibility with existing
// plans.
export type MealSlotValue = MealEntry | MealEntry[] | null
export type DayMeals = Partial<Record<MealSlot, MealSlotValue>>
export type WeekPlanMeals = Partial<Record<WeekDay, DayMeals>>

// Normalizes any slot value (null, a bare entry, or an array) into a flat
// array of entries, so callers never need to branch on the stored shape.
export const mealSlotEntries = (val: MealSlotValue): MealEntry[] => {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

export interface WeekPlan {
  id: string
  user_id: string
  title: string
  week_number: number | null
  year: number | null
  meals: WeekPlanMeals
  created_at: string
  updated_at: string
}

export type WeekPlanInsert = Omit<WeekPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>
