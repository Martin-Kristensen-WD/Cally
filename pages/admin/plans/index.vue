<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Dashboard</p>
        <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight leading-none">Ugeplaner</h1>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/admin/plans/new?test=true"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm tracking-[-0.01em] border border-charcoal-800/20 text-charcoal-700 hover:border-charcoal-800/40 hover:text-charcoal-800 transition-all duration-200"
        >
          + Ny test ugeplan
        </NuxtLink>
        <NuxtLink to="/admin/plans/new" class="btn-primary">+ Ny ugeplan</NuxtLink>
      </div>
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
          <NuxtLink :to="`/plans/${plan.id}`" class="flex-1 min-w-0">
            <p class="text-[14px] font-body font-semibold text-charcoal-800 truncate">{{ plan.title }}</p>
            <p class="text-[12px] font-body text-charcoal-700/40 mt-0.5">
              {{ plan.year ?? '' }}{{ plan.week_number && plan.year ? ' · ' : '' }}{{ formatDate(plan.created_at) }}
            </p>
          </NuxtLink>

          <!-- Meal count -->
          <span class="text-[12px] font-body text-charcoal-700/30 hidden sm:block flex-shrink-0">
            {{ mealCount(plan) }} måltider
          </span>

          <!-- Actions: always visible on mobile, hover-reveal on desktop -->
          <div class="flex items-center gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-150">
            <NuxtLink :to="`/plans/${plan.id}`" class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex">Vis</NuxtLink>
            <NuxtLink :to="`/admin/plans/${plan.id}/edit`" class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex">Rediger</NuxtLink>
            <NuxtLink :to="`/admin/plans/${plan.id}/edit`" class="btn-ghost text-[12px] py-1.5 px-2 sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </NuxtLink>
            <button class="btn-ghost text-[12px] py-1.5 px-3 text-red-400 hover:bg-red-50 hidden sm:inline-flex" @click="handleDelete(plan.id)">Slet</button>
            <button class="btn-ghost text-[12px] py-1.5 px-2 text-red-400 hover:bg-red-50 sm:hidden" @click="handleDelete(plan.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
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
