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
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-5 py-3.5 pr-11 bg-cream-50 hover:bg-cream-100 transition-colors duration-150"
            @click="toggleDay(day)"
          >
            <span class="font-display text-[16px] font-semibold text-charcoal-800 tracking-tight">{{ WEEK_DAY_LABELS[day] }}</span>
            <div class="flex items-center gap-3">
              <span v-if="dayKcal(day) > 0" class="text-[12px] font-body tabular-nums">
                <span class="font-semibold text-charcoal-800">{{ dayKcal(day) }}</span>
                <span class="text-charcoal-700/40"> kcal</span>
              </span>
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
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-charcoal-700/35 hover:text-spice-500 hover:bg-cream-100 transition-colors"
            title="Kopiér dag til en anden dag"
            @click.stop="openDayMenu(day, $event)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <rect x="9" y="9" width="11" height="11" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

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
                  <optgroup :label="MEAL_SLOT_LABELS[slot as MealSlot]">
                    <option v-for="recipe in slotRecipes(slot)" :key="recipe.id" :value="recipe.id">
                      {{ recipeOptionLabel(recipe) }}
                    </option>
                  </optgroup>
                  <optgroup label="Alle opskrifter">
                    <option v-for="recipe in recipes" :key="`all-${recipe.id}`" :value="recipe.id">
                      {{ recipeOptionLabel(recipe) }}
                    </option>
                  </optgroup>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-700/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <span
                v-if="slotKcal(day, slot) > 0"
                class="flex-shrink-0 w-16 text-right text-[11px] font-body text-charcoal-700/40 tabular-nums"
              >
                {{ slotKcal(day, slot) }} kcal
              </span>
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
                class="flex-shrink-0 p-1.5 rounded-md transition-colors"
                :class="slotAsCustomFood(day, slot).excludeFromShoppingList ? 'text-spice-500 bg-spice-50' : 'text-charcoal-700/25 hover:text-charcoal-700/50 hover:bg-cream-50'"
                title="Ikke en indkøbsvare (udelades fra indkøbslisten)"
                @click="toggleExcludeFromShoppingList(day, slot)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                  <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  <path v-if="slotAsCustomFood(day, slot).excludeFromShoppingList" d="M3 3l18 18" />
                </svg>
              </button>
              <button
                type="button"
                class="flex-shrink-0 text-[12px] font-body text-charcoal-700/35 hover:text-spice-500 transition-colors whitespace-nowrap"
                @click="switchToRecipe(day, slot)"
              >
                Fra opskrift
              </button>
            </template>

            <button
              type="button"
              class="flex-shrink-0 p-1 rounded-md text-charcoal-700/30 hover:text-spice-500 hover:bg-cream-50 transition-colors"
              title="Kopiér måltid til en anden dag"
              @click="openSlotMenu(day, slot, $event)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                <rect x="9" y="9" width="11" height="11" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
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

  <Teleport to="body">
    <div v-if="copyMenu" class="fixed inset-0 z-40" @click="closeCopyMenu" />
    <div
      v-if="copyMenu"
      class="fixed z-50 w-44 bg-white rounded-lg py-1"
      :style="{ top: `${copyMenu.top}px`, left: `${copyMenu.left}px`, boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }"
    >
      <p class="px-3 py-1.5 text-[10px] font-body font-semibold text-charcoal-700/40 uppercase tracking-wide">Kopiér til</p>
      <button
        v-for="item in copyMenu.items"
        :key="item.key"
        type="button"
        class="w-full text-left px-3 py-1.5 text-[13px] font-body text-charcoal-800 hover:bg-cream-50 transition-colors"
        @click="selectCopyTarget(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import type { WeekPlan, WeekPlanInsert, CustomFood, MealSlot, MealSlotValue, DayMeals, WeekDay } from '~/types/plan'
import { MEAL_SLOTS, MEAL_SLOT_LABELS, WEEK_DAYS, WEEK_DAY_LABELS } from '~/types/plan'

const SLOT_TO_MEAL_TYPE: Record<string, string> = {
  breakfast: 'Breakfast',
  snack: 'Snack',
  lunch: 'Lunch',
  snack2: 'Snack',
  dinner: 'Dinner',
  dessert: 'Dessert',
}

const slotRecipes = (slot: string) => {
  const mealType = SLOT_TO_MEAL_TYPE[slot]
  if (!mealType) return []
  return props.recipes.filter(r => r.meal_types.includes(mealType))
}

const recipeOptionLabel = (recipe: Recipe) =>
  recipe.estimated_calories ? `${recipe.title} — ${recipe.estimated_calories} kcal` : recipe.title

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

const toggleExcludeFromShoppingList = (day: string, slot: string) => {
  const food = slotAsCustomFood(day, slot)
  food.excludeFromShoppingList = !food.excludeFromShoppingList
}

const filledCount = (day: string) =>
  MEAL_SLOTS.filter((slot) => {
    const val = form.meals[day as WeekDay]?.[slot]
    if (!val) return false
    if (typeof val === 'object') return !!(val as CustomFood).name.trim()
    return true
  }).length

const recipeMap = computed(() => {
  const map = new Map<string, Recipe>()
  props.recipes.forEach(r => map.set(r.id, r))
  return map
})

const slotKcal = (day: string, slot: string): number => {
  const val = form.meals[day as WeekDay]?.[slot as MealSlot]
  if (!val) return 0
  if (typeof val === 'object') return (val as CustomFood).calories ?? 0
  return recipeMap.value.get(val as string)?.estimated_calories ?? 0
}

const dayKcal = (day: string): number =>
  MEAL_SLOTS.reduce((sum, slot) => sum + slotKcal(day, slot), 0)

// Copy-to-day-X popover, teleported to <body> to escape the accordion's overflow-hidden
interface CopyMenuState {
  top: number
  left: number
  items: { key: WeekDay; label: string }[]
  onSelect: (targetDay: WeekDay) => void
}
const copyMenu = ref<CopyMenuState | null>(null)
const copyMenuTrigger = ref<string | null>(null)

const closeCopyMenu = () => {
  copyMenu.value = null
  copyMenuTrigger.value = null
}

const otherDays = (day: WeekDay) => WEEK_DAYS.filter(d => d !== day)

const openCopyMenu = (triggerKey: string, event: MouseEvent, onSelect: (targetDay: WeekDay) => void, day: WeekDay) => {
  if (copyMenuTrigger.value === triggerKey) {
    closeCopyMenu()
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  copyMenuTrigger.value = triggerKey
  copyMenu.value = {
    top: rect.bottom + 4,
    left: Math.max(8, rect.right - 176),
    items: otherDays(day).map(d => ({ key: d, label: WEEK_DAY_LABELS[d] })),
    onSelect,
  }
}

const cloneMealValue = (val: MealSlotValue): MealSlotValue =>
  (typeof val === 'object' && val !== null) ? { ...val } : val

const copyDayTo = (fromDay: WeekDay, toDay: WeekDay) => {
  const source = form.meals[fromDay] ?? {}
  const copied: DayMeals = {}
  for (const slot of MEAL_SLOTS) {
    copied[slot] = cloneMealValue(source[slot] ?? '')
  }
  form.meals[toDay] = copied
}

const copySlotTo = (fromDay: WeekDay, slot: MealSlot, toDay: WeekDay) => {
  const val = form.meals[fromDay]?.[slot] ?? ''
  form.meals[toDay] = form.meals[toDay] ?? {}
  form.meals[toDay]![slot] = cloneMealValue(val)
}

const openDayMenu = (day: WeekDay, event: MouseEvent) => {
  openCopyMenu(`day:${day}`, event, (targetDay) => copyDayTo(day, targetDay), day)
}

const openSlotMenu = (day: WeekDay, slot: MealSlot, event: MouseEvent) => {
  openCopyMenu(`slot:${day}:${slot}`, event, (targetDay) => copySlotTo(day, slot, targetDay), day)
}

const selectCopyTarget = (targetDay: WeekDay) => {
  copyMenu.value?.onSelect(targetDay)
  closeCopyMenu()
}

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
