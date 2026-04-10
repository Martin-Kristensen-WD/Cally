export const useFavorites = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const fetchFavoriteIds = async (): Promise<string[]> => {
    if (!user.value) return []
    const { data, error } = await supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', user.value.id)
    if (error) throw error
    return (data ?? []).map((f: { recipe_id: string }) => f.recipe_id)
  }

  const toggleFavorite = async (recipeId: string, currentlyFavorited: boolean) => {
    if (!user.value) return
    if (currentlyFavorited) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.value.id)
        .eq('recipe_id', recipeId)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.value.id, recipe_id: recipeId })
      if (error) throw error
    }
  }

  return { fetchFavoriteIds, toggleFavorite }
}
