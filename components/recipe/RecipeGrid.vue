<template>
  <div>
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="n in 8"
        :key="n"
        class="recipe-card animate-pulse"
      >
        <div class="aspect-[3/4] bg-cream-200" />
        <div class="p-4 space-y-2">
          <div class="h-5 bg-cream-200 rounded w-3/4" />
          <div class="h-4 bg-cream-200 rounded w-1/2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="recipes.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div v-else class="text-center py-24 text-charcoal-700/40">
      <div class="text-6xl mb-4">🍴</div>
      <p class="font-display text-xl">No recipes yet.</p>
      <p class="text-sm mt-1">Check back soon!</p>
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
