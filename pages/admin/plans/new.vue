<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/plans" class="inline-flex items-center gap-2 text-[13px] font-display text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4 group">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
          <path d="M74 20 H8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M32 7 L8 20 L32 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Tilbage
      </NuxtLink>
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Ny ugeplan</h1>
    </div>

    <div v-if="pending" class="bg-white rounded-[20px] p-8 animate-pulse h-40" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />

    <div v-else class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <WeekPlanForm ref="formRef" :recipes="recipes ?? []" :prefill="testPrefill" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import type { WeekPlanInsert, WeekPlanMeals } from '~/types/plan'
import { WEEK_DAYS } from '~/types/plan'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const isTest = route.query.test === 'true'

const getISOWeek = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

const nextWeek = getISOWeek(new Date()) + 1
const currentYear = new Date().getFullYear()

const buildTestMeals = (recipes: Recipe[]): WeekPlanMeals => {
  if (!recipes.length) return {}
  const byCategory = (cat: string) => recipes.filter(r => r.meal_types?.includes(cat))
  const breakfast = byCategory('Breakfast')
  const lunch = byCategory('Lunch')
  const dinner = byCategory('Dinner')
  const snack = byCategory('Snack')
  const pick = (bucket: Recipe[], i: number): string | null => {
    const pool = bucket.length ? bucket : recipes
    return pool[i % pool.length]?.id ?? null
  }
  const meals: WeekPlanMeals = {}
  WEEK_DAYS.forEach((day, i) => {
    meals[day] = {
      breakfast: pick(breakfast, i),
      snack: pick(snack, i),
      lunch: pick(lunch, i),
      snack2: pick(snack, i + 2),
      dinner: pick(dinner, i),
    }
  })
  return meals
}

const { fetchRecipes } = useRecipes()
const { createPlan } = usePlans()
const formRef = ref()

const { data: recipes, pending } = await useAsyncData(
  'plan-new-recipes',
  () => fetchRecipes(),
  { server: false },
)

const testPrefill = computed<Partial<WeekPlanInsert> | undefined>(() => {
  if (!isTest) return undefined
  return {
    title: `[TEST] Uge ${nextWeek} – Familiemad`,
    week_number: nextWeek,
    year: currentYear,
    meals: buildTestMeals(recipes.value ?? []),
  }
})

const handleSubmit = async (data: WeekPlanInsert) => {
  try {
    await createPlan(data)
    await navigateTo('/admin/plans')
  }
  catch (e: unknown) {
    formRef.value?.setError(e instanceof Error ? e.message : 'Kunne ikke oprette ugeplanen.')
    formRef.value?.setSaving(false)
  }
}
</script>
