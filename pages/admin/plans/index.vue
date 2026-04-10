<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Dashboard</p>
        <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight leading-none">Ugeplaner</h1>
      </div>
      <NuxtLink to="/admin/plans/new" class="btn-primary">+ Ny ugeplan</NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="n in 3" :key="n" class="bg-white rounded-[20px] h-20 animate-pulse" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />
    </div>

    <!-- Plans list -->
    <div v-else-if="plans?.length" class="bg-white rounded-[20px] overflow-hidden" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <div class="px-6 py-4 border-b border-charcoal-800/[0.05]">
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase">Alle planer</p>
      </div>
      <ul class="divide-y divide-charcoal-800/[0.04]">
        <li
          v-for="plan in plans"
          :key="plan.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-cream-50/60 transition-colors group"
        >
          <!-- Week badge -->
          <div class="w-12 h-12 rounded-[10px] bg-cream-100 flex flex-col items-center justify-center flex-shrink-0">
            <span class="text-[10px] font-body font-semibold text-charcoal-700/40 tracking-[0.06em] uppercase leading-none">Uge</span>
            <span class="font-display text-[18px] font-semibold text-charcoal-800 leading-tight">{{ plan.week_number ?? '—' }}</span>
          </div>

          <!-- Title + meta -->
          <div class="flex-1 min-w-0">
            <p class="text-[14px] font-body font-semibold text-charcoal-800 truncate">{{ plan.title }}</p>
            <p class="text-[12px] font-body text-charcoal-700/40 mt-0.5">
              {{ plan.year ?? '' }}{{ plan.week_number && plan.year ? ' · ' : '' }}{{ formatDate(plan.created_at) }}
            </p>
          </div>

          <!-- Meal count -->
          <span class="text-[12px] font-body text-charcoal-700/30 hidden sm:block flex-shrink-0">
            {{ mealCount(plan) }} måltider
          </span>

          <!-- Actions -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
            <NuxtLink :to="`/plans/${plan.id}`" class="btn-ghost text-[12px] py-1.5 px-3">Vis</NuxtLink>
            <NuxtLink :to="`/admin/plans/${plan.id}/edit`" class="btn-ghost text-[12px] py-1.5 px-3">Rediger</NuxtLink>
            <button class="btn-ghost text-[12px] py-1.5 px-3 text-red-400 hover:bg-red-50" @click="handleDelete(plan.id)">Slet</button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Empty -->
    <div v-else class="bg-white rounded-[20px] py-20 text-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-2">Ingen ugeplaner endnu.</p>
      <p class="text-[13px] font-body text-charcoal-700/30 mb-6">Opret din første ugeplan med måltider.</p>
      <NuxtLink to="/admin/plans/new" class="btn-primary">+ Opret ugeplan</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { WeekPlan } from '~/types/plan'
import { MEAL_SLOTS, WEEK_DAYS } from '~/types/plan'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchPlans, deletePlan } = usePlans()

const { data: plans, pending, refresh } = await useAsyncData(
  'admin-plans',
  () => fetchPlans(),
  { server: false },
)

const mealCount = (plan: WeekPlan) => {
  let count = 0
  for (const day of WEEK_DAYS) {
    for (const slot of MEAL_SLOTS) {
      if (plan.meals?.[day]?.[slot]) count++
    }
  }
  return count
}

const handleDelete = async (id: string) => {
  if (!confirm('Slet denne ugeplan?')) return
  await deletePlan(id)
  await refresh()
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
</script>
