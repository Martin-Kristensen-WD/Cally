<template>
  <div class="min-h-screen">

    <!-- Loading -->
    <div v-if="pending" class="max-w-6xl mx-auto px-5 py-14 animate-pulse space-y-8">
      <div class="h-10 bg-cream-100 rounded-xl w-64" />
      <div class="grid grid-cols-7 gap-3">
        <div v-for="n in 7" :key="n" class="bg-white rounded-[20px] h-80" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06)" />
      </div>
    </div>

    <template v-else-if="plan">
      <!-- Hero -->
      <section class="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <NuxtLink to="/" class="print:hidden inline-flex items-center gap-2 text-[13px] font-display text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-6 group">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
            <path d="M74 20 H8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M32 7 L8 20 L32 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Tilbage
        </NuxtLink>
        <div class="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p v-if="plan.week_number" class="text-[12px] font-body font-semibold text-spice-500 tracking-[0.08em] uppercase mb-2">
              Uge {{ plan.week_number }}{{ plan.year ? ` · ${plan.year}` : '' }}
            </p>
            <h1 class="font-display text-[38px] sm:text-[50px] font-semibold text-charcoal-800 tracking-tight leading-[1.05]">
              {{ plan.title }}
            </h1>
          </div>
          <div class="print:hidden flex items-center gap-2 flex-shrink-0">
            <NuxtLink :to="`/plans/${plan.id}/shopping-list`" class="btn-secondary text-[13px]">Indkøbsliste</NuxtLink>
            <template v-if="isAdmin">
              <button class="btn-secondary text-[13px]" @click="exportPdf">Eksportér som PDF</button>
              <NuxtLink :to="`/admin/plans/${plan.id}/edit`" class="btn-secondary text-[13px]">Rediger</NuxtLink>
            </template>
          </div>
        </div>
      </section>

      <!-- ── MOBILE: stacked day rows ── -->
      <section class="print:!hidden lg:hidden max-w-2xl mx-auto px-5 pb-16 space-y-3">
        <div
          v-for="day in WEEK_DAYS"
          :key="`m-${day}`"
          class="bg-white rounded-[20px] overflow-hidden"
          style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
        >
          <!-- Day header -->
          <div class="px-5 py-4 border-b border-charcoal-800/[0.05] flex items-center justify-between">
            <p class="font-display text-[18px] font-semibold text-charcoal-800 tracking-tight">{{ WEEK_DAY_LABELS[day] }}</p>
            <div v-if="dayKcal(day)" class="flex items-baseline gap-1">
              <span class="font-display text-[16px] font-semibold text-charcoal-800">{{ dayKcal(day) }}</span>
              <span class="text-[10px] font-body font-medium text-charcoal-700/40 tracking-wide uppercase">kcal</span>
            </div>
          </div>

          <!-- Meal rows -->
          <div class="divide-y divide-charcoal-800/[0.04]">
            <div
              v-for="slot in MEAL_SLOTS"
              :key="slot"
              class="flex items-start gap-6 px-5 py-3.5"
            >
              <span class="text-[11px] font-body font-semibold text-charcoal-700/40 tracking-[0.04em] uppercase w-36 flex-shrink-0 mt-0.5">
                {{ MEAL_SLOT_LABELS[slot] }}
              </span>

              <div v-if="getEntries(day, slot).length" class="flex-1 min-w-0 space-y-2">
                <div v-for="(entry, i) in getEntries(day, slot)" :key="i">
                  <NuxtLink
                    v-if="getRecipeFromEntry(entry)"
                    :to="`/recipes/${getRecipeFromEntry(entry)!.id}`"
                    class="block group"
                  >
                    <p class="text-[13px] font-body font-semibold text-charcoal-800 truncate group-hover:text-spice-500 transition-colors">
                      {{ getRecipeFromEntry(entry)!.title }}
                    </p>
                    <p v-if="getRecipeFromEntry(entry)!.estimated_calories" class="text-[11px] font-body text-charcoal-700/35">
                      {{ getRecipeFromEntry(entry)!.estimated_calories }} kcal
                    </p>
                  </NuxtLink>

                  <div v-else-if="isCustomFood(entry)">
                    <p class="text-[13px] font-body font-semibold text-charcoal-800 truncate">
                      {{ entry.name }}
                    </p>
                    <p v-if="entry.calories" class="text-[11px] font-body text-charcoal-700/35">
                      {{ entry.calories }} kcal
                    </p>
                  </div>

                  <div v-else-if="isFoodItemEntry(entry) && getFoodItemFromEntry(entry)">
                    <p class="text-[13px] font-body font-semibold text-charcoal-800 truncate">
                      {{ getFoodItemFromEntry(entry)!.name }}
                    </p>
                    <p class="text-[11px] font-body text-charcoal-700/35">
                      {{ formatAmountUnit(entry.amount, getFoodItemFromEntry(entry)!.unit) }} · {{ foodItemEntryCalories(entry, getFoodItemFromEntry(entry)) }} kcal
                    </p>
                  </div>

                  <!-- Stale reference (recipe or food item was deleted) -->
                  <span v-else class="text-[13px] font-body text-charcoal-700/20">—</span>
                </div>
              </div>

              <span v-else class="flex-1 text-[13px] font-body text-charcoal-700/20">—</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── DESKTOP: 7-column grid (also used for print/PDF export) ── -->
      <section class="print:!block hidden lg:block max-w-6xl mx-auto px-5 pb-16 print:px-0 print:pb-0">
        <div class="grid grid-cols-7 gap-3 print:gap-2">
          <div
            v-for="day in WEEK_DAYS"
            :key="`d-${day}`"
            class="print:!shadow-none print:border print:border-charcoal-800/15 bg-white rounded-[20px] overflow-hidden flex flex-col"
            style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)"
          >
            <!-- Day header -->
            <div class="px-3 py-3 border-b border-charcoal-800/[0.05] text-center">
              <p class="font-display text-[16px] font-semibold text-charcoal-800 tracking-tight">{{ WEEK_DAY_SHORT[day] }}</p>
            </div>

            <!-- Meal slots -->
            <div class="flex-1 divide-y divide-charcoal-800/[0.04]">
              <div
                v-for="slot in MEAL_SLOTS"
                :key="slot"
                class="px-3 py-3.5"
              >
                <p class="text-[11px] font-body font-semibold text-charcoal-700/50 tracking-[0.06em] uppercase mb-2">
                  {{ MEAL_SLOT_LABELS[slot] }}
                </p>

                <div v-if="getEntries(day, slot).length" class="space-y-2">
                  <div v-for="(entry, i) in getEntries(day, slot)" :key="i">
                    <NuxtLink v-if="getRecipeFromEntry(entry)" :to="`/recipes/${getRecipeFromEntry(entry)!.id}`" class="group block">
                      <p class="text-[14px] font-body font-semibold text-charcoal-800 leading-snug group-hover:text-spice-500 transition-colors line-clamp-2">
                        {{ getRecipeFromEntry(entry)!.title }}
                      </p>
                      <p v-if="getRecipeFromEntry(entry)!.estimated_calories" class="text-[12px] font-body text-charcoal-700/45 mt-1">
                        {{ getRecipeFromEntry(entry)!.estimated_calories }} kcal
                      </p>
                    </NuxtLink>

                    <div v-else-if="isCustomFood(entry)">
                      <p class="text-[14px] font-body font-semibold text-charcoal-800 leading-snug line-clamp-2">
                        {{ entry.name }}
                      </p>
                      <p v-if="entry.calories" class="text-[12px] font-body text-charcoal-700/45 mt-1">
                        {{ entry.calories }} kcal
                      </p>
                    </div>

                    <div v-else-if="isFoodItemEntry(entry) && getFoodItemFromEntry(entry)">
                      <p class="text-[14px] font-body font-semibold text-charcoal-800 leading-snug line-clamp-2">
                        {{ getFoodItemFromEntry(entry)!.name }}
                      </p>
                      <p class="text-[12px] font-body text-charcoal-700/45 mt-1">
                        {{ formatAmountUnit(entry.amount, getFoodItemFromEntry(entry)!.unit) }} · {{ foodItemEntryCalories(entry, getFoodItemFromEntry(entry)) }} kcal
                      </p>
                    </div>

                    <!-- Stale reference (recipe or food item was deleted) -->
                    <span v-else class="text-[13px] font-body text-charcoal-700/25">—</span>
                  </div>
                </div>

                <div v-else class="h-6 flex items-center">
                  <span class="text-[13px] font-body text-charcoal-700/25">—</span>
                </div>
              </div>
            </div>

            <!-- Daily kcal total -->
            <div class="px-3 py-3 border-t border-charcoal-800/[0.06] bg-cream-50">
              <div v-if="dayKcal(day)" class="flex items-baseline justify-center gap-1">
                <span class="font-display text-[18px] font-semibold text-charcoal-800 tracking-tight">{{ dayKcal(day) }}</span>
                <span class="text-[11px] font-body font-medium text-charcoal-700/45 tracking-wide uppercase">kcal</span>
              </div>
              <div v-else class="text-center">
                <span class="text-[13px] font-body text-charcoal-700/25">—</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Not found -->
    <div v-else class="max-w-sm mx-auto px-5 py-20 text-center">
      <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-4">Ugeplanen findes ikke.</p>
      <NuxtLink to="/" class="btn-primary">Gå til forsiden</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import type { FoodItem } from '~/types/foodItem'
import type { MealEntry, MealSlot, WeekDay } from '~/types/plan'
import { MEAL_SLOTS, MEAL_SLOT_LABELS, WEEK_DAYS, WEEK_DAY_LABELS, WEEK_DAY_SHORT, mealSlotEntries, isCustomFood, isFoodItemEntry } from '~/types/plan'

const route = useRoute()
const { fetchPlan } = usePlans()
const { fetchRecipes } = useRecipes()
const { fetchFoodItems } = useFoodItems()
const { isAdmin } = useAuth()

const { data: plan, pending } = await useAsyncData(
  `plan-${route.params.id}`,
  () => fetchPlan(route.params.id as string),
)

// Fetch all recipes so we can look them up by ID
const { data: allRecipes } = await useAsyncData(
  'plan-view-recipes',
  () => fetchRecipes(),
)

const { data: allFoodItems } = await useAsyncData(
  'plan-view-food-items',
  () => fetchFoodItems(),
)

const recipeMap = computed(() => {
  const map = new Map<string, Recipe>()
  allRecipes.value?.forEach(r => map.set(r.id, r))
  return map
})

const foodItemMap = computed(() => {
  const map = new Map<string, FoodItem>()
  allFoodItems.value?.forEach(f => map.set(f.id, f))
  return map
})

const getEntries = (day: string, slot: string): MealEntry[] =>
  mealSlotEntries(plan.value?.meals?.[day as WeekDay]?.[slot as MealSlot] ?? null)

const getRecipeFromEntry = (entry: MealEntry): Recipe | undefined =>
  typeof entry === 'string' && entry ? recipeMap.value.get(entry) : undefined

const getFoodItemFromEntry = (entry: MealEntry): FoodItem | undefined =>
  isFoodItemEntry(entry) ? foodItemMap.value.get(entry.food_item_id) : undefined

// Opens the browser's print dialog with the desktop grid forced visible via
// print: styles — the user picks "Save as PDF" there. Simple client-side
// approach, no server rendering or PDF library needed.
const exportPdf = () => window.print()

const dayKcal = (day: string): number => {
  let total = 0
  for (const slot of MEAL_SLOTS) {
    for (const entry of getEntries(day, slot)) {
      if (isCustomFood(entry)) total += entry.calories ?? 0
      else if (isFoodItemEntry(entry)) total += foodItemEntryCalories(entry, foodItemMap.value.get(entry.food_item_id))
      else total += getRecipeFromEntry(entry)?.estimated_calories ?? 0
    }
  }
  return total
}
</script>
