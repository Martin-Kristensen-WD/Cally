export interface FoodItem {
  id: string
  name: string
  unit: string
  reference_amount: number
  reference_calories: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export type FoodItemInsert = Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>
export type FoodItemUpdate = Partial<FoodItemInsert>
