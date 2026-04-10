export const MEAL_SLOTS = ['breakfast', 'snack', 'lunch', 'snack2', 'dinner'] as const
export type MealSlot = typeof MEAL_SLOTS[number]

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: 'Morgenmad',
  snack: 'Formiddagssnack',
  lunch: 'Frokost',
  snack2: 'Eftermiddagssnack',
  dinner: 'Aftensmad',
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

// meals[day][slot] = recipe_id | null
export type DayMeals = Partial<Record<MealSlot, string | null>>
export type WeekPlanMeals = Partial<Record<WeekDay, DayMeals>>

export interface WeekPlan {
  id: string
  title: string
  week_number: number | null
  year: number | null
  meals: WeekPlanMeals
  created_at: string
  updated_at: string
}

export type WeekPlanInsert = Omit<WeekPlan, 'id' | 'created_at' | 'updated_at'>
