<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <p class="font-body text-[13px] font-medium text-terracotta tracking-[0.08em] uppercase mb-3">Mad inspiration</p>
      <h1 class="font-display text-[42px] sm:text-[56px] font-semibold text-charcoal-800 tracking-tight leading-[1.05] mb-8">
        Opskrifter<br class="hidden sm:block" /><span class="text-charcoal-800/30"> der smager af mere.</span>
      </h1>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex-1 min-w-0">
          <CategoryFilter v-model="selectedCategory" />
        </div>

        <!-- Search -->
        <div class="relative group w-full sm:w-52">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-charcoal-700/35 pointer-events-none transition-colors duration-200 group-focus-within:text-charcoal-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            v-model="search"
            type="search"
            placeholder="Søg…"
            class="w-full h-9 rounded-full bg-charcoal-800/[0.05] pl-9 pr-8 text-[13px] font-body text-charcoal-800 placeholder-charcoal-700/35 outline-none transition-all duration-200 focus:bg-white focus:w-72 focus:shadow-[0_0_0_1px_rgba(28,25,23,0.12),0_2px_8px_rgba(28,25,23,0.06)] [&::-webkit-search-cancel-button]:hidden"
          />
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-75"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-75"
          >
            <button
              v-if="search"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-charcoal-700/20 hover:bg-charcoal-700/30 flex items-center justify-center transition-colors"
              @click="search = ''"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-2 h-2 text-charcoal-800/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section class="max-w-6xl mx-auto px-5 pb-16">
      <div class="flex items-center justify-between mb-6">
        <span class="text-[13px] font-body text-charcoal-700/40">
          {{ filteredCount }} {{ filteredCount !== 1 ? 'opskrifter' : 'opskrift' }}
        </span>
        <button
          v-if="search || selectedCategory !== 'All'"
          class="text-[13px] font-body text-charcoal-700/40 hover:text-charcoal-800 transition-colors"
          @click="search = ''; selectedCategory = 'All'"
        >
          Ryd filter
        </button>
      </div>

      <RecipeGrid :recipes="filteredRecipes" :loading="pending" />

      <!-- No results -->
      <div v-if="!pending && filteredCount === 0 && (allRecipes?.length ?? 0) > 0" class="text-center py-20">
        <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-2">Ingen resultater for "{{ search }}"</p>
        <p class="text-[13px] font-body text-charcoal-700/30 mb-6">Prøv et andet søgeord eller ryd filteret.</p>
        <button class="btn-primary" @click="search = ''; selectedCategory = 'All'">Ryd filter</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'

const { fetchRecipes } = useRecipes()
const selectedCategory = ref('All')
const search = ref('')

// Fetch all recipes once — filter client-side
const { data: allRecipes, pending } = await useAsyncData(
  'recipes-all',
  () => fetchRecipes(),
)

const filteredRecipes = computed<Recipe[]>(() => {
  let result = allRecipes.value ?? []

  if (selectedCategory.value !== 'All') {
    result = result.filter(r => r.categories?.includes(selectedCategory.value))
  }

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.ingredients?.some(i => i.item.toLowerCase().includes(q))
    )
  }

  return result
})

const filteredCount = computed(() => filteredRecipes.value.length)
</script>
