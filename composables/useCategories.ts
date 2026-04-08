import { CATEGORIES } from '~/types/recipe'

export const useCategories = () => {
  // Return the static category list — Supabase DISTINCT queries work too
  // but static is simpler and keeps the UI consistent even with no recipes yet
  return { categories: ['All', ...CATEGORIES] as string[] }
}
