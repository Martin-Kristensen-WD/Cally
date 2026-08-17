<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <div class="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <p class="font-body text-[13px] font-medium text-terracotta tracking-[0.08em] uppercase mb-3">Enkle tilføjelser</p>
          <h1 class="font-display text-[42px] sm:text-[56px] font-semibold text-charcoal-800 tracking-tight leading-[1.05]">
            Fødevarer<br class="hidden sm:block" /><span class="text-charcoal-800/30"> til dine ugeplaner.</span>
          </h1>
        </div>
        <NuxtLink v-if="isAdmin" to="/admin/food-items/new" class="btn-primary flex-shrink-0">+ Ny fødevare</NuxtLink>
      </div>

      <!-- Search -->
      <div class="relative group w-full sm:w-72">
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-charcoal-700/35 pointer-events-none transition-colors duration-200 group-focus-within:text-charcoal-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          v-model="search"
          type="search"
          placeholder="Søg…"
          class="w-full h-9 rounded-full bg-charcoal-800/[0.05] pl-9 pr-8 text-[13px] font-body text-charcoal-800 placeholder-charcoal-700/35 outline-none transition-all duration-200 focus:bg-white focus:shadow-[0_0_0_1px_rgba(28,25,23,0.12),0_2px_8px_rgba(28,25,23,0.06)] [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
    </section>

    <!-- Grid -->
    <section class="max-w-6xl mx-auto px-5 pb-16">
      <div class="flex items-center justify-between mb-6">
        <span class="text-[13px] font-body text-charcoal-700/40">
          {{ filteredCount }} {{ filteredCount !== 1 ? 'fødevarer' : 'fødevare' }}
        </span>
        <button
          v-if="search"
          class="text-[13px] font-body text-charcoal-700/40 hover:text-charcoal-800 transition-colors"
          @click="search = ''"
        >
          Ryd søgning
        </button>
      </div>

      <FoodItemGrid :food-items="filteredFoodItems" :loading="pending" />

      <!-- No results -->
      <div v-if="!pending && filteredCount === 0 && (allFoodItems?.length ?? 0) > 0" class="text-center py-20">
        <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-2">Ingen resultater</p>
        <p class="text-[13px] font-body text-charcoal-700/30 mb-6">Prøv et andet søgeord.</p>
        <button class="btn-primary" @click="search = ''">Ryd søgning</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FoodItem } from '~/types/foodItem'

const { fetchFoodItems } = useFoodItems()
const { isAdmin } = useAuth()
const search = ref('')

const { data: allFoodItems, pending } = await useAsyncData(
  'food-items-all',
  () => fetchFoodItems(),
)

const filteredFoodItems = computed<FoodItem[]>(() => {
  let result = allFoodItems.value ?? []

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(i => i.name.toLowerCase().includes(q))
  }

  return result
})

const filteredCount = computed(() => filteredFoodItems.value.length)
</script>
