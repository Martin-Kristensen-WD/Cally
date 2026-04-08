<template>
  <div class="space-y-2">
    <div
      v-for="(ingredient, index) in modelValue"
      :key="index"
      class="flex gap-2 items-center"
    >
      <input
        v-model="ingredient.amount"
        type="text"
        placeholder="Amount"
        class="form-input w-24 flex-shrink-0"
        @input="emitUpdate"
      />
      <input
        v-model="ingredient.unit"
        type="text"
        placeholder="Unit"
        class="form-input w-24 flex-shrink-0"
        list="units-list"
        @input="emitUpdate"
      />
      <input
        v-model="ingredient.item"
        type="text"
        placeholder="Ingredient"
        class="form-input flex-1"
        @input="emitUpdate"
      />
      <button
        type="button"
        class="text-charcoal-700/40 hover:text-red-500 transition-colors flex-shrink-0 p-1"
        @click="remove(index)"
      >
        ✕
      </button>
    </div>

    <datalist id="units-list">
      <option v-for="u in units" :key="u" :value="u" />
    </datalist>

    <button
      type="button"
      class="btn-ghost text-sm mt-2"
      @click="add"
    >
      + Add ingredient
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Ingredient } from '~/types/recipe'

const props = defineProps<{
  modelValue: Ingredient[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Ingredient[]]
}>()

const units = ['cup', 'cups', 'tbsp', 'tsp', 'g', 'kg', 'ml', 'l', 'oz', 'lb', 'piece', 'pieces', 'slice', 'slices']

const add = () => {
  emit('update:modelValue', [...props.modelValue, { amount: '', unit: '', item: '' }])
}

const remove = (index: number) => {
  const updated = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', updated)
}

const emitUpdate = () => {
  emit('update:modelValue', [...props.modelValue])
}
</script>
