import type { WeekPlan, WeekPlanInsert } from '~/types/plan'

export const usePlans = () => {
  const supabase = useSupabaseClient()

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('week_plans')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as WeekPlan[]
  }

  const fetchPlan = async (id: string) => {
    const { data, error } = await supabase
      .from('week_plans')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as WeekPlan
  }

  const createPlan = async (plan: WeekPlanInsert) => {
    const { data, error } = await supabase
      .from('week_plans')
      .insert(plan)
      .select()
      .single()
    if (error) throw error
    return data as WeekPlan
  }

  const updatePlan = async (id: string, plan: Partial<WeekPlanInsert>) => {
    const { data, error } = await supabase
      .from('week_plans')
      .update(plan)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as WeekPlan
  }

  const deletePlan = async (id: string) => {
    const { error } = await supabase
      .from('week_plans')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  return { fetchPlans, fetchPlan, createPlan, updatePlan, deletePlan }
}
