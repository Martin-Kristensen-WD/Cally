<template>
  <div class="relative">
    <!-- Right fade -->
    <div class="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

    <div class="flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['category-pill flex-shrink-0', { active: modelValue === cat }]"
        @click="$emit('update:modelValue', cat)"
      >
        {{ CATEGORY_LABELS[cat] ?? cat }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_LABELS } from '~/types/recipe'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { categories } = useCategories()
</script>
