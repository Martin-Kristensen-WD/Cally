<template>
  <div class="space-y-2.5">
    <div
      v-for="(ingredient, index) in modelValue"
      :key="index"
      class="flex gap-2 items-center rounded-xl transition-colors duration-100"
      :class="{
        'opacity-40': dragIndex === index,
        'bg-charcoal-800/[0.03]': dragOverIndex === index && dragIndex !== index,
      }"
      @dragover.prevent="dragOverIndex = index"
      @drop.prevent="onDrop(index)"
    >
      <!-- Drag handle -->
      <div
        draggable="true"
        class="flex-shrink-0 cursor-grab active:cursor-grabbing text-charcoal-700/20 hover:text-charcoal-700/50 transition-colors touch-none"
        @dragstart="onDragStart($event, index)"
        @dragend="onDragEnd"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3.5" fill="currentColor" viewBox="0 0 8 14">
          <circle cx="2" cy="2" r="1.5" />
          <circle cx="6" cy="2" r="1.5" />
          <circle cx="2" cy="7" r="1.5" />
          <circle cx="6" cy="7" r="1.5" />
          <circle cx="2" cy="12" r="1.5" />
          <circle cx="6" cy="12" r="1.5" />
        </svg>
      </div>

      <input
        :ref="(el) => { if (el) itemRefs[index] = el as HTMLInputElement }"
        v-model="ingredient.item"
        type="text"
        placeholder="Ingrediens"
        class="form-input flex-1"
        @input="emitUpdate"
        @keydown.enter.prevent="add"
      />
      <input
        v-model="ingredient.amount"
        type="text"
        placeholder="Antal"
        class="form-input w-20 flex-shrink-0"
        @input="emitUpdate"
        @keydown.enter.prevent="add"
      />
      <div class="relative w-28 flex-shrink-0">
        <select
          v-model="ingredient.unit"
          class="form-input w-full appearance-none pr-8 cursor-pointer"
          :class="ingredient.unit === '' ? 'text-charcoal-700/30' : 'text-charcoal-800'"
          @change="emitUpdate"
          @keydown.enter.prevent="add"
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

const itemRefs: HTMLInputElement[] = []

const add = () => {
  const newIndex = props.modelValue.length
  emit('update:modelValue', [...props.modelValue, { amount: '', unit: '', item: '' }])
  nextTick(() => itemRefs[newIndex]?.focus())
}

const remove = (index: number) => {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

const emitUpdate = () => {
  emit('update:modelValue', [...props.modelValue])
}

// ── Drag to reorder ──────────────────────────────────────
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (e: DragEvent, index: number) => {
  dragIndex.value = index
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const onDrop = (index: number) => {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    const updated = [...props.modelValue]
    const [moved] = updated.splice(dragIndex.value, 1)
    updated.splice(index, 0, moved)
    emit('update:modelValue', updated)
  }
  dragIndex.value = null
  dragOverIndex.value = null
}

const onDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}
</script>
