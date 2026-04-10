<template>
  <div>
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      <div
        v-for="n in 8"
        :key="n"
        class="bg-white rounded-[20px] overflow-hidden animate-pulse"
        style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
      >
        <div class="aspect-[3/4] bg-cream-100" />
        <div class="px-4 py-3.5 space-y-2">
          <div class="h-4 bg-cream-100 rounded-lg w-3/4" />
          <div class="h-3 bg-cream-100 rounded-lg w-1/2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="recipes.length"
      class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div v-else class="text-center py-28 text-charcoal-700/30">
      <p class="font-display text-2xl font-medium tracking-tight mb-2">Ingen opskrifter endnu.</p>
      <p class="text-[13px] font-body">Kig forbi igen snart!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'

defineProps<{
  recipes: Recipe[]
  loading?: boolean
}>()
</script>
