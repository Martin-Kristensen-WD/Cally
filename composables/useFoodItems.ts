import type { FoodItem, FoodItemInsert, FoodItemUpdate } from '~/types/foodItem'

export const useFoodItems = () => {
  const supabase = useSupabaseClient()

  const fetchFoodItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data as FoodItem[]
  }

  const fetchFoodItem = async (id: string) => {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as FoodItem
  }

  const createFoodItem = async (item: FoodItemInsert) => {
    const { data, error } = await supabase
      .from('food_items')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data as FoodItem
  }

  const updateFoodItem = async (id: string, item: FoodItemUpdate) => {
    const { data, error } = await supabase
      .from('food_items')
      .update(item)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as FoodItem
  }

  const deleteFoodItem = async (id: string) => {
    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  const deleteFoodItems = async (ids: string[]) => {
    const { error } = await supabase
      .from('food_items')
      .delete()
      .in('id', ids)

    if (error) throw error
  }

  const uploadImage = async (file: File, foodItemId: string) => {
    const ext = file.name.split('.').pop()
    const path = `${foodItemId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('food-item-images')
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('food-item-images')
      .getPublicUrl(path)

    return `${data.publicUrl}?t=${Date.now()}`
  }

  return { fetchFoodItems, fetchFoodItem, createFoodItem, updateFoodItem, deleteFoodItem, deleteFoodItems, uploadImage }
}
