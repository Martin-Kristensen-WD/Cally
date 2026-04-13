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
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Rediger ugeplan</h1>
    </div>

    <div v-if="pending" class="bg-white rounded-[20px] p-8 animate-pulse h-40" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />

    <div v-else-if="plan" class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <WeekPlanForm ref="formRef" :plan="plan" :recipes="recipes ?? []" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeekPlanInsert } from '~/types/plan'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const { fetchRecipes } = useRecipes()
const { fetchPlan, updatePlan } = usePlans()
const formRef = ref()

const { data: plan, pending } = await useAsyncData(
  `edit-plan-${route.params.id}`,
  () => fetchPlan(route.params.id as string),
  { server: false },
)

const { data: recipes } = await useAsyncData(
  'plan-edit-recipes',
  () => fetchRecipes(),
  { server: false },
)

const handleSubmit = async (data: WeekPlanInsert) => {
  try {
    await updatePlan(route.params.id as string, data)
    await navigateTo('/admin/plans')
  }
  catch (e: unknown) {
    formRef.value?.setError(e instanceof Error ? e.message : 'Kunne ikke gemme ændringerne.')
    formRef.value?.setSaving(false)
  }
}
</script>
