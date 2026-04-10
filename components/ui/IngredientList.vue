<template>
  <div class="space-y-2.5">
    <div
      v-for="(ingredient, index) in modelValue"
      :key="index"
      class="flex gap-2 items-center"
    >
      <input
        v-model="ingredient.item"
        type="text"
        placeholder="Ingrediens"
        class="form-input flex-1"
        @input="emitUpdate"
      />
      <input
        v-model="ingredient.amount"
        type="text"
        placeholder="Antal"
        class="form-input w-20 flex-shrink-0"
        @input="emitUpdate"
      />
      <select
        v-model="ingredient.unit"
        class="form-input w-28 flex-shrink-0"
        @change="emitUpdate"
      >
        <option value="">Enhed</option>
        <option v-for="u in units" :key="u.value" :value="u.value">{{ u.label }}</option>
      </select>
      <button
        type="button"
        class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-charcoal-700/25 hover:text-red-400 transition-colors"
        @click="remove(index)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="btn-ghost text-[13px] mt-1"
      @click="add"
    >
      + Tilføj ingrediens
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

const units = [
  { value: 'g', label: 'g – gram' },
  { value: 'kg', label: 'kg – kilogram' },
  { value: 'ml', label: 'ml – milliliter' },
  { value: 'dl', label: 'dl – deciliter' },
  { value: 'l', label: 'l – liter' },
  { value: 'tsk', label: 'tsk – teskefuld' },
  { value: 'spsk', label: 'spsk – spiseskefuld' },
  { value: 'stk', label: 'stk – stykker' },
  { value: 'fed', label: 'fed – hvidløg' },
  { value: 'skive', label: 'skive' },
  { value: 'bundt', label: 'bundt' },
  { value: 'håndfuld', label: 'håndfuld' },
  { value: 'knivspids', label: 'knivspids' },
  { value: 'dåse', label: 'dåse' },
  { value: 'pose', label: 'pose' },
]

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
