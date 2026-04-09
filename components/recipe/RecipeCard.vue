<template>
  <NuxtLink :to="`/recipes/${recipe.id}`" class="recipe-card block group">
    <div class="relative aspect-[3/4] bg-cream-100 overflow-hidden">
      <img
        v-if="recipe.image_url"
        :src="recipe.image_url"
        :alt="recipe.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-cream-100 to-cream-200"
      >
        🍽️
      </div>
      <div class="absolute top-3 left-3 flex flex-wrap gap-1">
        <span
          v-for="cat in recipe.categories"
          :key="cat"
          class="bg-white/90 text-spice-600 text-xs font-bold px-3 py-1 rounded-full"
        >
          {{ CATEGORY_LABELS[cat] ?? cat }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-display font-bold text-lg text-charcoal-800 leading-snug mb-1 line-clamp-2">
        {{ recipe.title }}
      </h3>
      <p v-if="recipe.description" class="text-sm text-charcoal-700/60 line-clamp-2 mb-3">
        {{ recipe.description }}
      </p>
      <div v-if="recipe.estimated_calories" class="calorie-badge">
        🔥 {{ recipe.estimated_calories }} kcal
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import { CATEGORY_LABELS } from '~/types/recipe'

defineProps<{
  recipe: Recipe
}>()
</script>
