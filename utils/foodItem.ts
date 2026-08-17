import type { FoodItem } from '~/types/foodItem'
import type { FoodItemEntry } from '~/types/plan'

export const foodItemEntryCalories = (entry: FoodItemEntry, item: FoodItem | undefined): number =>
  item && entry.amount != null ? Math.round((entry.amount / item.reference_amount) * item.reference_calories) : 0

// Unit is optional — omit the trailing unit rather than leaving a stray space.
export const formatAmountUnit = (amount: number | null | undefined, unit: string): string =>
  unit ? `${amount ?? ''} ${unit}`.trim() : String(amount ?? '')
