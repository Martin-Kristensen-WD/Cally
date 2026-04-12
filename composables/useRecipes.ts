import type { Recipe, RecipeInsert, RecipeUpdate } from '~/types/recipe'

export const useRecipes = () => {
  const supabase = useSupabaseClient()

  const fetchRecipes = async (category?: string) => {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.contains('meal_types', [category])
    }

    const { data, error } = await query
    if (error) throw error
    return data as Recipe[]
  }

  const fetchRecipe = async (id: string) => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Recipe
  }

  const createRecipe = async (recipe: RecipeInsert) => {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipe)
      .select()
      .single()

    if (error) throw error
    return data as Recipe
  }

  const updateRecipe = async (id: string, recipe: RecipeUpdate) => {
    const { data, error } = await supabase
      .from('recipes')
      .update(recipe)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Recipe
  }

  const duplicateRecipe = async (id: string) => {
    const { id: _, created_at, updated_at, ...rest } = await fetchRecipe(id)
    return createRecipe({ ...rest, title: `Kopi af ${rest.title}` })
  }

  const deleteRecipe = async (id: string) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  const deleteRecipes = async (ids: string[]) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .in('id', ids)

    if (error) throw error
  }

  const uploadImage = async (file: File, recipeId: string) => {
    const ext = file.name.split('.').pop()
    const path = `${recipeId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(path, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(path)

    return data.publicUrl
  }

  return { fetchRecipes, fetchRecipe, createRecipe, updateRecipe, deleteRecipe, deleteRecipes, duplicateRecipe, uploadImage }
}
