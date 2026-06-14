<template>
  <form class="space-y-8" @submit.prevent="handleSubmit">

    <!-- Plan meta -->
    <div class="grid sm:grid-cols-3 gap-5">
      <div class="sm:col-span-2">
        <label class="form-label">Titel *</label>
        <input v-model="form.title" type="text" class="form-input" placeholder="f.eks. Uge 16 – Familiemad" required />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="form-label">Uge</label>
          <input v-model.number="form.week_number" type="number" class="form-input" placeholder="16" min="1" max="53" />
        </div>
        <div>
          <label class="form-label">År</label>
          <input v-model.number="form.year" type="number" class="form-input" :placeholder="currentYear" min="2020" />
        </div>
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Day-by-day meal selector -->
    <div class="space-y-6">
      <div
        v-for="day in WEEK_DAYS"
        :key="day"
        class="rounded-[16px] border border-charcoal-800/[0.06] overflow-hidden"
      >
        <!-- Day header -->
        <button
          type="button"
          class="w-full flex items-center justify-between px-5 py-3.5 bg-cream-50 hover:bg-cream-100 transition-colors duration-150"
          @click="toggleDay(day)"
        >
          <span class="font-display text-[16px] font-semibold text-charcoal-800 tracking-tight">{{ WEEK_DAY_LABELS[day] }}</span>
          <div class="flex items-center gap-3">
            <span class="text-[12px] font-body text-charcoal-700/40">
              {{ filledCount(day) }}/{{ MEAL_SLOTS.length }} måltider
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-charcoal-700/40 transition-transform duration-200"
              :class="openDays.has(day) ? 'rotate-180' : ''"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Meal slots -->
        <div v-show="openDays.has(day)" class="divide-y divide-charcoal-800/[0.04]">
          <div
            v-for="slot in MEAL_SLOTS"
            :key="slot"
            class="flex items-center gap-3 px-5 py-3"
          >
            <span class="text-[13px] font-body font-medium text-charcoal-700/60 w-40 flex-shrink-0">
              {{ MEAL_SLOT_LABELS[slot] }}
            </span>

            <!-- Recipe mode -->
            <template v-if="!isCustom(day, slot)">
              <div class="relative flex-1">
                <select
                  :value="(form.meals[day]?.[slot] as string) || ''"
                  class="form-input w-full appearance-none pr-8"
                  :class="!form.meals[day]?.[slot] ? 'text-charcoal-700/30' : 'text-charcoal-800'"
                  @change="form.meals[day]![slot] = ($event.target as HTMLSelectElement).value"
                >
                  <option value="">Ingen</option>
                  <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
                    {{ recipe.title }}
                  </option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-700/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button
                type="button"
                class="flex-shrink-0 text-[12px] font-body text-charcoal-700/35 hover:text-spice-500 transition-colors whitespace-nowrap"
                @click="switchToCustom(day, slot)"
              >
                + Tilpas
              </button>
            </template>

            <!-- Custom food mode -->
            <template v-else>
              <input
                :value="slotAsCustomFood(day, slot).name"
                type="text"
                class="form-input flex-1"
                placeholder="f.eks. Glas mælk og banan"
                @input="slotAsCustomFood(day, slot).name = ($event.target as HTMLInputElement).value"
              />
              <input
                :value="slotAsCustomFood(day, slot).calories ?? ''"
                type="number"
                class="form-input w-24 flex-shrink-0"
                placeholder="kcal"
                min="0"
                @input="slotAsCustomFood(day, slot).calories = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null"
              />
              <button
                type="button"
                class="flex-shrink-0 text-[12px] font-body text-charcoal-700/35 hover:text-spice-500 transition-colors whitespace-nowrap"
                @click="switchToRecipe(day, slot)"
              >
                Fra opskrift
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-charcoal-800/[0.06]" />

    <!-- Actions -->
    <div class="flex items-center gap-3">
      <button type="submit" class="btn-primary" :disabled="saving">
        {{ saving ? 'Gemmer…' : (isEdit ? 'Gem ændringer' : 'Opret ugeplan') }}
      </button>
      <NuxtLink to="/admin/plans" class="btn-ghost text-[13px]">Annuller</NuxtLink>
    </div>

    <p v-if="error" class="text-[13px] font-body text-red-500">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import type { WeekPlan, WeekPlanInsert, CustomFood, MealSlot, WeekDay } from '~/types/plan'
import { MEAL_SLOTS, MEAL_SLOT_LABELS, WEEK_DAYS, WEEK_DAY_LABELS } from '~/types/plan'

const props = defineProps<{
  plan?: WeekPlan
  prefill?: Partial<WeekPlanInsert>
  recipes: Recipe[]
}>()

const emit = defineEmits<{
  submit: [data: WeekPlanInsert]
}>()

const saving = ref(false)
const error = ref('')
const currentYear = new Date().getFullYear()

// Build an empty meals skeleton — every day, every slot defaults to ''
const emptyMeals = (): WeekPlanInsert['meals'] => {
  const meals: WeekPlanInsert['meals'] = {}
  for (const day of WEEK_DAYS) {
    meals[day] = {}
    for (const slot of MEAL_SLOTS) {
      meals[day]![slot] = props.plan?.meals?.[day]?.[slot] ?? props.prefill?.meals?.[day]?.[slot] ?? ''
    }
  }
  return meals
}

const form = reactive<WeekPlanInsert>({
  title: props.plan?.title ?? props.prefill?.title ?? '',
  week_number: props.plan?.week_number ?? props.prefill?.week_number ?? null,
  year: props.plan?.year ?? props.prefill?.year ?? currentYear,
  meals: emptyMeals(),
})

// Accordion — open Monday by default
const openDays = ref<Set<string>>(new Set(['monday']))
const toggleDay = (day: string) => {
  if (openDays.value.has(day)) openDays.value.delete(day)
  else openDays.value.add(day)
}

const isCustom = (day: string, slot: string): boolean => {
  const val = form.meals[day as WeekDay]?.[slot as MealSlot]
  return typeof val === 'object' && val !== null
}

const slotAsCustomFood = (day: string, slot: string): CustomFood =>
  form.meals[day as WeekDay]![slot as MealSlot] as CustomFood

const switchToCustom = (day: string, slot: string) => {
  form.meals[day as WeekDay]![slot as MealSlot] = { type: 'custom', name: '', calories: null }
}

const switchToRecipe = (day: string, slot: string) => {
  form.meals[day as WeekDay]![slot as MealSlot] = ''
}

const filledCount = (day: string) =>
  MEAL_SLOTS.filter((slot) => {
    const val = form.meals[day as WeekDay]?.[slot]
    if (!val) return false
    if (typeof val === 'object') return !!(val as CustomFood).name.trim()
    return true
  }).length

const isEdit = computed(() => !!props.plan)

const handleSubmit = async () => {
  if (!form.title.trim()) {
    error.value = 'Titel er påkrævet.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    // Clean empty strings/blank custom foods to null before saving
    const cleanedMeals: WeekPlanInsert['meals'] = {}
    for (const day of WEEK_DAYS) {
      cleanedMeals[day] = {}
      for (const slot of MEAL_SLOTS) {
        const val = form.meals[day]?.[slot]
        if (typeof val === 'object' && val !== null) {
          cleanedMeals[day]![slot] = (val as CustomFood).name.trim() ? val : null
        }
        else {
          cleanedMeals[day]![slot] = (val as string) || null
        }
      }
    }
    emit('submit', { ...form, meals: cleanedMeals })
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Noget gik galt.'
    saving.value = false
  }
}

defineExpose({
  setSaving: (val: boolean) => { saving.value = val },
  setError: (msg: string) => { error.value = msg },
})
</script>
