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
      <div class="relative w-28 flex-shrink-0">
        <select
          v-model="ingredient.unit"
          class="form-input w-full appearance-none pr-8 cursor-pointer"
          :class="ingredient.unit === '' ? 'text-charcoal-700/30' : 'text-charcoal-800'"
          @change="emitUpdate"
        >
          <option value="">Enhed</option>
          <option v-for="u in units" :key="u.value" :value="u.value">{{ u.label }}</option>
        </select>
        <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-700/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
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
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'dl', label: 'dl' },
  { value: 'l', label: 'l' },
  { value: 'tsk', label: 'tsk' },
  { value: 'spsk', label: 'spsk' },
  { value: 'stk', label: 'stk' },
  { value: 'fed', label: 'fed' },
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
