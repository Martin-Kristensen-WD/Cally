<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/plans" class="inline-flex items-center gap-1.5 text-[13px] font-body text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4">
        ← Tilbage
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
