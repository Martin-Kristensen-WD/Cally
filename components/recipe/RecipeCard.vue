<template>
  <NuxtLink :to="`/recipes/${recipe.id}`" class="recipe-card block group">
    <!-- Image -->
    <div class="relative aspect-[3/4] bg-cream-100 overflow-hidden">
      <img
        v-if="recipe.image_url"
        :src="recipe.image_url"
        :alt="recipe.title"
        class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)"
      >
        <span class="font-display font-semibold leading-none select-none text-[5rem] text-charcoal-800/[0.08]">{{ recipe.title.charAt(0) }}</span>
      </div>

      <!-- Category tags — frosted glass overlay at bottom -->
      <div v-if="recipe.categories?.length" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pt-10 pb-3 px-3">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="cat in recipe.categories"
            :key="cat"
            class="bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-[10px] font-body font-semibold px-2.5 py-1 rounded-full border border-white/20 tracking-wide"
          >
            {{ CATEGORY_LABELS[cat] ?? cat }}
          </span>
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="px-4 py-4">
      <h3 class="font-display font-semibold text-[19px] sm:text-[17px] text-charcoal-800 leading-[1.25] mb-1 line-clamp-2 tracking-tight">
        {{ recipe.title }}
      </h3>
      <div class="flex items-center justify-between mt-2 gap-2">
        <p v-if="recipe.description" class="text-[13px] text-charcoal-700/50 font-body line-clamp-1 flex-1">
          {{ recipe.description }}
        </p>
        <span v-if="recipe.estimated_calories" class="flex-shrink-0 text-[12px] sm:text-[11px] font-body font-semibold tracking-wide" :style="{ color: calorieColor(recipe.estimated_calories) }">
          {{ recipe.estimated_calories }} kcal
        </span>
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

const calorieColor = (kcal: number) => {
  if (kcal < 300) return '#E8BB72'
  if (kcal < 500) return '#D4834A'
  return '#9C4A1E'
}
</script>
