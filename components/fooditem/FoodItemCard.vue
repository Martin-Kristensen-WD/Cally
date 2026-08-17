<template>
  <div class="recipe-card block">
    <!-- Image -->
    <div class="relative aspect-[4/3] sm:aspect-[5/4] bg-cream-100 overflow-hidden">
      <img
        v-if="foodItem.image_url"
        :src="foodItem.image_url"
        :alt="foodItem.name"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)"
      >
        <span class="font-display font-semibold leading-none select-none text-[5rem] text-charcoal-800/[0.08]">{{ foodItem.name.charAt(0) }}</span>
      </div>
    </div>

    <!-- Details -->
    <div class="px-4 py-4">
      <h3 class="font-display font-semibold text-[21px] sm:text-[17px] text-charcoal-800 leading-[1.25] mb-1 line-clamp-2 tracking-tight">
        {{ foodItem.name }}
      </h3>
      <span class="text-[13px] sm:text-[11px] font-body font-semibold text-charcoal-700/50 tracking-wide">
        {{ foodItem.reference_calories }} kcal / {{ formatAmountUnit(foodItem.reference_amount, foodItem.unit) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FoodItem } from '~/types/foodItem'

defineProps<{
  foodItem: FoodItem
}>()
</script>
