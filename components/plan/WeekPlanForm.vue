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
            class="px-5 py-3"
          >
            <!-- Slot header: label, combined kcal, add-dish, copy-to-day -->
            <div class="flex items-center gap-2 mb-2">
              <span class="text-[13px] font-body font-medium text-charcoal-700/60 flex-shrink-0">
                {{ MEAL_SLOT_LABELS[slot] }}
              </span>
              <span
                v-if="slotKcal(day, slot) > 0"
                class="text-[11px] font-body text-charcoal-700/40 tabular-nums"
              >
                {{ slotKcal(day, slot) }} kcal
              </span>
              <div class="flex-1" />
              <button
                type="button"
                class="flex-shrink-0 p-1 rounded-md text-charcoal-700/30 hover:text-spice-500 hover:bg-cream-50 transition-colors"
                title="Tilføj endnu en ret til dette måltid"
                @click="addEntry(day, slot)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                  <path d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
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

            <!-- One row per dish in this slot — stacked on mobile, side by side on desktop -->
            <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <div
                v-for="(entry, i) in entriesOf(day, slot)"
                :key="i"
                class="flex flex-col gap-1.5 sm:flex-1 sm:min-w-[260px]"
              >
                <!-- Mode toggle -->
                <div class="flex items-center gap-2">
                  <div class="flex-shrink-0 flex items-center gap-0.5 p-0.5 rounded-full bg-cream-100">
                    <button
                      type="button"
                      class="px-2 py-1 rounded-full text-[11px] font-body font-medium transition-colors whitespace-nowrap"
                      :class="!isCustomFood(entry) && !isFoodItemEntry(entry) ? 'bg-white text-charcoal-800 shadow-sm' : 'text-charcoal-700/40 hover:text-charcoal-700/70'"
                      @click="switchEntryToRecipe(day, slot, i)"
                    >
                      Opskrift
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 rounded-full text-[11px] font-body font-medium transition-colors whitespace-nowrap"
                      :class="isFoodItemEntry(entry) ? 'bg-white text-charcoal-800 shadow-sm' : 'text-charcoal-700/40 hover:text-charcoal-700/70'"
                      @click="switchEntryToFoodItem(day, slot, i)"
                    >
                      Fødevare
                    </button>
                    <button
                      type="button"
                      class="px-2 py-1 rounded-full text-[11px] font-body font-medium transition-colors whitespace-nowrap"
                      :class="isCustomFood(entry) ? 'bg-white text-charcoal-800 shadow-sm' : 'text-charcoal-700/40 hover:text-charcoal-700/70'"
                      @click="switchEntryToCustom(day, slot, i)"
                    >
                      Tilpas
                    </button>
                  </div>
                  <div class="flex-1" />
                  <button
                    v-if="entriesOf(day, slot).length > 1"
                    type="button"
                    class="flex-shrink-0 p-1 rounded-md text-charcoal-700/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Fjern denne ret"
                    @click="removeEntry(day, slot, i)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Recipe mode -->
                  <template v-if="!isCustomFood(entry) && !isFoodItemEntry(entry)">
                    <div class="relative flex-1">
                      <select
                        :value="(entry as string) || ''"
                        class="form-input w-full appearance-none pr-8"
                        :class="!entry ? 'text-charcoal-700/30' : 'text-charcoal-800'"
                        @change="entriesOf(day, slot)[i] = ($event.target as HTMLSelectElement).value"
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
                  </template>

                  <!-- Food item mode -->
                  <template v-else-if="isFoodItemEntry(entry)">
                    <div class="relative flex-1">
                      <select
                        :value="entry.food_item_id"
                        class="form-input w-full appearance-none pr-8"
                        :class="!entry.food_item_id ? 'text-charcoal-700/30' : 'text-charcoal-800'"
                        @change="entry.food_item_id = ($event.target as HTMLSelectElement).value"
                      >
                        <option value="">Ingen</option>
                        <option v-for="item in sortedFoodItems" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-700/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      :value="entry.amount ?? ''"
                      type="number"
                      class="form-input w-20 flex-shrink-0"
                      placeholder="Antal"
                      min="0"
                      step="any"
                      @input="entry.amount = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null"
                    />
                    <span class="flex-shrink-0 w-12 text-[12px] font-body text-charcoal-700/40">
                      {{ foodItemMap.get(entry.food_item_id)?.unit ?? '' }}
                    </span>
                  </template>

                  <!-- Custom food mode -->
                  <template v-else>
                    <input
                      :value="(entry as CustomFood).name"
                      type="text"
                      class="form-input flex-1"
                      placeholder="f.eks. Glas mælk og banan"
                      @input="(entry as CustomFood).name = ($event.target as HTMLInputElement).value"
                    />
                    <input
                      :value="(entry as CustomFood).calories ?? ''"
                      type="number"
                      class="form-input w-24 flex-shrink-0"
                      placeholder="kcal"
                      min="0"
                      @input="(entry as CustomFood).calories = ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null"
                    />
                    <button
                      type="button"
                      class="flex-shrink-0 p-1.5 rounded-md transition-colors"
                      :class="(entry as CustomFood).excludeFromShoppingList ? 'text-spice-500 bg-spice-50' : 'text-charcoal-700/25 hover:text-charcoal-700/50 hover:bg-cream-50'"
                      title="Ikke en indkøbsvare (udelades fra indkøbslisten)"
                      @click="(entry as CustomFood).excludeFromShoppingList = !(entry as CustomFood).excludeFromShoppingList"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                        <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        <path v-if="(entry as CustomFood).excludeFromShoppingList" d="M3 3l18 18" />
                      </svg>
                    </button>
                  </template>
                </div>
              </div>
            </div>
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
import type { FoodItem } from '~/types/foodItem'
import type { WeekPlan, WeekPlanInsert, CustomFood, MealEntry, MealSlot, MealSlotValue, DayMeals, WeekDay } from '~/types/plan'
import { MEAL_SLOTS, MEAL_SLOT_LABELS, WEEK_DAYS, WEEK_DAY_LABELS, mealSlotEntries, isCustomFood, isFoodItemEntry } from '~/types/plan'

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
  foodItems: FoodItem[]
}>()

const sortedFoodItems = computed(() => [...props.foodItems].sort((a, b) => a.name.localeCompare(b.name, 'da')))
const foodItemMap = computed(() => new Map(props.foodItems.map(f => [f.id, f])))

const emit = defineEmits<{
  submit: [data: WeekPlanInsert]
}>()

const saving = ref(false)
const error = ref('')
const currentYear = new Date().getFullYear()

// Build an empty meals skeleton. Every slot is stored internally as an
// array of dishes (never a bare value) so the form can always iterate over
// it; a slot with nothing chosen yet gets a single empty entry so there's
// always at least one selector to fill in.
const emptyMeals = (): WeekPlanInsert['meals'] => {
  const meals: WeekPlanInsert['meals'] = {}
  for (const day of WEEK_DAYS) {
    meals[day] = {}
    for (const slot of MEAL_SLOTS) {
      const existing = props.plan?.meals?.[day]?.[slot] ?? props.prefill?.meals?.[day]?.[slot] ?? null
      const entries = mealSlotEntries(existing)
      meals[day]![slot] = entries.length ? entries : ['']
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

// The reactive array backing a slot — mutating the returned array (push,
// splice, index assignment) mutates the form directly.
const entriesOf = (day: string, slot: string): MealEntry[] =>
  (form.meals[day as WeekDay]?.[slot as MealSlot] as MealEntry[]) ?? []

const addEntry = (day: string, slot: string) => {
  entriesOf(day, slot).push('')
}

const removeEntry = (day: string, slot: string, index: number) => {
  entriesOf(day, slot).splice(index, 1)
}

const switchEntryToCustom = (day: string, slot: string, index: number) => {
  entriesOf(day, slot).splice(index, 1, { type: 'custom', name: '', calories: null })
}

const switchEntryToRecipe = (day: string, slot: string, index: number) => {
  entriesOf(day, slot).splice(index, 1, '')
}

const switchEntryToFoodItem = (day: string, slot: string, index: number) => {
  entriesOf(day, slot).splice(index, 1, { type: 'food_item', food_item_id: '', amount: null })
}

const filledCount = (day: string) =>
  MEAL_SLOTS.filter(slot =>
    entriesOf(day, slot).some((entry) => {
      if (isCustomFood(entry)) return !!entry.name.trim()
      if (isFoodItemEntry(entry)) return !!entry.food_item_id
      return !!entry
    })
  ).length

const recipeMap = computed(() => {
  const map = new Map<string, Recipe>()
  props.recipes.forEach(r => map.set(r.id, r))
  return map
})

const slotKcal = (day: string, slot: string): number =>
  entriesOf(day, slot).reduce((sum, entry) => {
    if (isCustomFood(entry)) return sum + (entry.calories ?? 0)
    if (isFoodItemEntry(entry)) return sum + foodItemEntryCalories(entry, foodItemMap.value.get(entry.food_item_id))
    return sum + (entry ? (recipeMap.value.get(entry)?.estimated_calories ?? 0) : 0)
  }, 0)

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

// Always yields at least one entry, matching emptyMeals(), so a copied slot
// never ends up with zero visible rows.
const cloneEntries = (val: MealSlotValue): MealEntry[] => {
  const entries = mealSlotEntries(val).map(entry => typeof entry === 'object' && entry !== null ? { ...entry } : entry)
  return entries.length ? entries : ['']
}

const copyDayTo = (fromDay: WeekDay, toDay: WeekDay) => {
  const source = form.meals[fromDay] ?? {}
  const copied: DayMeals = {}
  for (const slot of MEAL_SLOTS) {
    copied[slot] = cloneEntries(source[slot] ?? null)
  }
  form.meals[toDay] = copied
}

const copySlotTo = (fromDay: WeekDay, slot: MealSlot, toDay: WeekDay) => {
  const val = form.meals[fromDay]?.[slot] ?? null
  form.meals[toDay] = form.meals[toDay] ?? {}
  form.meals[toDay]![slot] = cloneEntries(val)
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
    // Drop empty entries (blank recipe selects, blank custom food names),
    // then collapse back to the simplest storage shape: null when nothing's
    // left, a bare entry for a single dish, or an array only when a slot
    // actually combines multiple dishes.
    const cleanedMeals: WeekPlanInsert['meals'] = {}
    for (const day of WEEK_DAYS) {
      cleanedMeals[day] = {}
      for (const slot of MEAL_SLOTS) {
        const entries = entriesOf(day, slot).filter((entry) => {
          if (isCustomFood(entry)) return !!entry.name.trim()
          if (isFoodItemEntry(entry)) return !!entry.food_item_id
          return !!entry
        })
        cleanedMeals[day]![slot] = entries.length === 0 ? null : entries.length === 1 ? entries[0] : entries
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
