import { MEAL_TYPES } from '~/types/recipe'

export const useCategories = () => {
  return { categories: ['All', ...MEAL_TYPES] as string[] }
}
