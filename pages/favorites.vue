<template>
  <div class="min-h-screen">

    <!-- Header -->
    <section class="max-w-6xl mx-auto px-5 pt-12 pb-10">
      <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Mine</p>
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <h1 class="font-display text-[42px] font-semibold text-charcoal-800 tracking-tight leading-none">Favoritter</h1>
        <span v-if="totalCount > 0" class="text-[14px] font-body text-charcoal-700/35 mb-0.5">{{ totalCount }} opskrifter</span>
      </div>
    </section>

    <!-- Loading -->
    <div v-if="pending" class="max-w-6xl mx-auto px-5 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        <div
          v-for="n in 8"
          :key="n"
          class="bg-white rounded-[20px] overflow-hidden animate-pulse"
          style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
        >
          <div class="aspect-[3/4] bg-cream-100" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-cream-100 rounded-lg w-3/4" />
            <div class="h-3 bg-cream-100 rounded-lg w-1/2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Grouped content -->
    <template v-else-if="groupedFavorites.length">
      <section
        v-for="(group, index) in groupedFavorites"
        :key="group.category"
        class="pb-12"
      >
        <!-- Section header -->
        <div class="max-w-6xl mx-auto px-5 flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <h2 class="font-display text-[20px] font-semibold text-charcoal-800 tracking-tight">
              {{ MEAL_TYPE_LABELS[group.category] ?? group.category }}
            </h2>
            <span class="text-[12px] font-body text-charcoal-700/35 tabular-nums">{{ group.recipes.length }}</span>
          </div>

          <!-- Arrow buttons — only shown when slider is active -->
          <div v-if="group.recipes.length > 4" class="flex items-center gap-1">
            <button
              class="w-8 h-8 rounded-full border border-charcoal-800/10 flex items-center justify-center text-charcoal-700/50 hover:text-charcoal-800 hover:border-charcoal-800/25 transition-all"
              @click="scroll(index, 'left')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              class="w-8 h-8 rounded-full border border-charcoal-800/10 flex items-center justify-center text-charcoal-700/50 hover:text-charcoal-800 hover:border-charcoal-800/25 transition-all"
              @click="scroll(index, 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Grid (≤4 items) -->
        <div
          v-if="group.recipes.length <= 4"
          class="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <RecipeCard v-for="recipe in group.recipes" :key="recipe.id" :recipe="recipe" />
        </div>

        <!-- Slider (>4 items) -->
        <div v-else class="relative">
          <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />
          <div
            :ref="el => { if (el) sliderRefs[index] = el as HTMLElement }"
            class="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth -my-10 py-10"
            style="padding-left: max(1.25rem, calc((100vw - 72rem) / 2 + 1.25rem)); padding-right: 4rem"
          >
            <RecipeCard
              v-for="recipe in group.recipes"
              :key="recipe.id"
              :recipe="recipe"
              class="flex-shrink-0 w-[76vw] sm:w-[30vw] lg:w-64"
            />
          </div>
        </div>
      </section>
    </template>

    <!-- Empty state -->
    <div v-else class="max-w-xs mx-auto px-5 py-24 text-center">
      <div class="w-14 h-14 rounded-full bg-charcoal-800/[0.05] flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-charcoal-700/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </div>
      <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight leading-snug mb-2">
        Ingen favoritter endnu.
      </p>
      <p class="text-[13px] font-body text-charcoal-700/30 mb-7">
        Gem opskrifter ved at klikke på hjertet på en opskrift.
      </p>
      <NuxtLink to="/" class="btn-primary">Udforsk opskrifter</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '~/types/recipe'

definePageMeta({ middleware: 'auth' })

const { fetchRecipes } = useRecipes()
const { fetchFavoriteIds } = useFavorites()

const { data, pending } = await useAsyncData(
  'favorites-page',
  async () => {
    const [ids, recipes] = await Promise.all([fetchFavoriteIds(), fetchRecipes()])
    return { ids, recipes }
  },
  { server: false },
)

const favoriteRecipes = computed<Recipe[]>(() => {
  if (!data.value) return []
  const { ids, recipes } = data.value
  return recipes.filter(r => ids.includes(r.id))
})

const totalCount = computed(() => favoriteRecipes.value.length)

const groupedFavorites = computed(() => {
  const groups: { category: string; recipes: Recipe[] }[] = []
  for (const type of MEAL_TYPES) {
    const recipes = favoriteRecipes.value.filter(r => r.meal_types?.includes(type))
    if (recipes.length > 0) groups.push({ category: type, recipes })
  }
  const uncategorized = favoriteRecipes.value.filter(
    r => !r.meal_types?.some(t => (MEAL_TYPES as readonly string[]).includes(t))
  )
  if (uncategorized.length > 0) groups.push({ category: 'Andet', recipes: uncategorized })
  return groups
})

const sliderRefs = ref<HTMLElement[]>([])

const scroll = (index: number, direction: 'left' | 'right') => {
  const el = sliderRefs.value[index]
  if (!el) return
  el.scrollBy({ left: direction === 'right' ? 280 : -280, behavior: 'smooth' })
}
</script>
