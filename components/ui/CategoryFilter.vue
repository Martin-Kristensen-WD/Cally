<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="cat in categories"
      :key="cat"
      :class="['category-pill', { active: modelValue === cat }]"
      @click="$emit('update:modelValue', cat)"
    >
      {{ CATEGORY_LABELS[cat] ?? cat }}
    </button>
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
