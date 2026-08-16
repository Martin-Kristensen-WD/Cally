<template>
  <div class="min-h-screen">

    <!-- Loading -->
    <div v-if="pending" class="max-w-2xl mx-auto px-5 py-14 animate-pulse space-y-4">
      <div class="h-9 bg-cream-100 rounded-xl w-48" />
      <div class="bg-white rounded-[20px] h-96" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06)" />
    </div>

    <template v-else-if="plan">
      <!-- Hero -->
      <section class="max-w-2xl mx-auto px-5 pt-14 pb-6">
        <NuxtLink :to="`/plans/${plan.id}`" class="inline-flex items-center gap-2 text-[13px] font-display text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-6 group">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
            <path d="M74 20 H8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M32 7 L8 20 L32 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Tilbage til ugeplan
        </NuxtLink>

        <p class="text-[12px] font-body font-semibold text-spice-500 tracking-[0.08em] uppercase mb-2">{{ plan.title }}</p>
        <h1 class="font-display text-[32px] sm:text-[42px] font-semibold text-charcoal-800 tracking-tight leading-[1.05]">
          Indkøbsliste
        </h1>
      </section>

      <!-- Day filter -->
      <section class="max-w-2xl mx-auto px-5 pb-5">
        <p class="text-[11px] font-body font-semibold text-charcoal-700/40 tracking-[0.06em] uppercase mb-2.5">Dage</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="day in WEEK_DAYS"
            :key="day"
            type="button"
            class="px-3 py-1.5 rounded-full text-[12px] font-body font-medium border transition-all duration-150"
            :class="includedDays.has(day)
              ? 'bg-charcoal-800 text-white border-charcoal-800'
              : 'border-charcoal-800/10 text-charcoal-700/40 hover:border-charcoal-800/20 hover:text-charcoal-700/70'"
            @click="toggleDay(day)"
          >
            {{ WEEK_DAY_SHORT[day] }}
          </button>
        </div>
      </section>

      <!-- List -->
      <section class="max-w-2xl mx-auto px-5 pb-16">
        <div class="bg-white rounded-[20px] overflow-hidden" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">

          <!-- Empty -->
          <div v-if="!ingredientLines.length && !otherLines.length" class="py-16 text-center px-6">
            <p class="text-[14px] font-body text-charcoal-700/35">Ingen ingredienser for de valgte dage.</p>
          </div>

          <template v-else>
            <ul class="divide-y divide-charcoal-800/[0.04]">
              <li
                v-for="line in ingredientLines"
                :key="line.id"
                class="flex items-center gap-3 px-5 py-3 cursor-pointer select-none"
                @click="toggleChecked(line.id)"
              >
                <div
                  class="flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150"
                  :class="checked.has(line.id) ? 'bg-charcoal-800 border-charcoal-800' : 'border-charcoal-800/20 bg-white'"
                >
                  <svg
                    v-if="checked.has(line.id)"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    class="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </div>
                <span class="flex-1 text-[14px] font-body font-medium text-charcoal-800 transition-all duration-150" :class="checked.has(line.id) ? 'line-through opacity-35' : ''">
                  {{ line.item }}
                </span>
                <span v-if="line.amountLabel" class="text-[13px] font-body text-charcoal-700/40 tabular-nums whitespace-nowrap transition-opacity duration-150" :class="checked.has(line.id) ? 'opacity-25' : ''">
                  {{ line.amountLabel }}
                </span>
              </li>
            </ul>

            <template v-if="otherLines.length">
              <div class="px-5 py-2.5 bg-cream-50 border-y border-charcoal-800/[0.05]">
                <p class="text-[11px] font-body font-semibold text-charcoal-700/40 tracking-[0.06em] uppercase">Andet</p>
              </div>
              <ul class="divide-y divide-charcoal-800/[0.04]">
                <li
                  v-for="line in otherLines"
                  :key="line.id"
                  class="flex items-center gap-3 px-5 py-3 cursor-pointer select-none"
                  @click="toggleChecked(line.id)"
                >
                  <div
                    class="flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150"
                    :class="checked.has(line.id) ? 'bg-charcoal-800 border-charcoal-800' : 'border-charcoal-800/20 bg-white'"
                  >
                    <svg
                      v-if="checked.has(line.id)"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 12 12"
                      class="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span class="flex-1 text-[14px] font-body font-medium text-charcoal-800 transition-all duration-150" :class="checked.has(line.id) ? 'line-through opacity-35' : ''">
                    {{ line.item }}
                  </span>
                  <span v-if="line.count > 1" class="text-[13px] font-body text-charcoal-700/40 tabular-nums whitespace-nowrap transition-opacity duration-150" :class="checked.has(line.id) ? 'opacity-25' : ''">
                    ×{{ line.count }}
                  </span>
                </li>
              </ul>
            </template>
          </template>

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
import type { CustomFood, MealSlot, WeekDay } from '~/types/plan'
import { MEAL_SLOTS, WEEK_DAYS, WEEK_DAY_SHORT } from '~/types/plan'

const route = useRoute()
const { fetchPlan } = usePlans()
const { fetchRecipes } = useRecipes()

const { data: plan, pending } = await useAsyncData(
  `plan-${route.params.id}`,
  () => fetchPlan(route.params.id as string),
)

const { data: allRecipes } = await useAsyncData(
  'plan-view-recipes',
  () => fetchRecipes(),
)

const recipeMap = computed(() => {
  const map = new Map<string, Recipe>()
  allRecipes.value?.forEach(r => map.set(r.id, r))
  return map
})

// All days included by default
const includedDays = ref<Set<WeekDay>>(new Set(WEEK_DAYS))
const toggleDay = (day: WeekDay) => {
  if (includedDays.value.has(day)) includedDays.value.delete(day)
  else includedDays.value.add(day)
  // trigger reactivity — Set mutation isn't tracked by Vue on its own
  includedDays.value = new Set(includedDays.value)
}

interface RawIngredient {
  item: string
  unit: string
  amount: string
  // A "+" in the item text (e.g. "Juice + rosiner") bundles multiple distinct
  // foods into one row — the quantity can't be split sensibly between them,
  // so each part is tallied as its own count-only item instead.
  forceCountOnly: boolean
}

const rawIngredients = computed<RawIngredient[]>(() => {
  const entries: RawIngredient[] = []
  if (!plan.value) return entries
  for (const day of WEEK_DAYS) {
    if (!includedDays.value.has(day)) continue
    for (const slot of MEAL_SLOTS) {
      const val = plan.value.meals?.[day]?.[slot as MealSlot]
      if (typeof val !== 'string' || !val) continue
      const recipe = recipeMap.value.get(val)
      recipe?.ingredients?.forEach((ing) => {
        const parts = splitCompoundItem(ing.item)
        if (parts.length > 1) {
          parts.forEach(part => entries.push({ item: part, unit: '', amount: '', forceCountOnly: true }))
        } else {
          entries.push({ item: parts[0] ?? ing.item.trim(), unit: (ing.unit ?? '').trim(), amount: (ing.amount ?? '').trim(), forceCountOnly: false })
        }
      })
    }
  }
  return entries
})

interface ShoppingLine {
  id: string
  item: string
  amountLabel: string
}

// Only ingredients with a real, measurable unit/amount live here. Anything
// without one — plain recipe ingredients like "Salt", parts split off a
// compound item, or custom food entries — goes into otherLines instead, so
// the same food mentioned both ways (e.g. "Banan" as an ingredient and as a
// custom food) consolidates into a single tally rather than two lines.
const ingredientLines = computed<ShoppingLine[]>(() => {
  const quantifiable = new Map<string, RawIngredient[]>()

  for (const entry of rawIngredients.value) {
    if (entry.forceCountOnly || (!entry.unit && !entry.amount)) continue
    const key = `${entry.item.toLowerCase()}|${entry.unit.toLowerCase()}`
    if (!quantifiable.has(key)) quantifiable.set(key, [])
    quantifiable.get(key)!.push(entry)
  }

  const lines: ShoppingLine[] = []

  // Group by item + unit. If every amount in a group parses as a number,
  // they're summed into one line; otherwise the amounts aren't summable
  // (e.g. "1 bundt" + "2 stk", or free-text amounts like "lidt"), so each
  // distinct raw amount is listed as its own line instead of guessing at a merge.
  for (const [key, group] of quantifiable) {
    const item = group[0].item
    const unit = group[0].unit

    const parsed = group.map(e => parseAmount(e.amount))
    if (parsed.every(n => n !== null)) {
      const sum = parsed.reduce((s, n) => s + (n as number), 0)
      lines.push({ id: key, item, amountLabel: unit ? `${formatAmount(sum)} ${unit}` : formatAmount(sum) })
      continue
    }

    const seen = new Set<string>()
    group.forEach((e, i) => {
      const rawKey = `${key}|${e.amount}`
      if (seen.has(rawKey)) return
      seen.add(rawKey)
      lines.push({ id: `${key}-${i}`, item, amountLabel: [e.amount, unit].filter(Boolean).join(' ') })
    })
  }

  return lines.sort((a, b) => a.item.localeCompare(b.item, 'da'))
})

interface OtherLine {
  id: string
  item: string
  count: number
}

// Everything with no measurable quantity — count-only ingredients and custom
// food entries — shares one tally so the same name recurring across both
// sources merges into a single "×N" line instead of listing twice.
const otherLines = computed<OtherLine[]>(() => {
  const counts = new Map<string, { item: string; count: number }>()
  const bump = (raw: string) => {
    const key = raw.toLowerCase()
    const existing = counts.get(key)
    counts.set(key, { item: existing?.item ?? raw, count: (existing?.count ?? 0) + 1 })
  }

  for (const entry of rawIngredients.value) {
    if (entry.forceCountOnly || (!entry.unit && !entry.amount)) bump(entry.item)
  }

  if (plan.value) {
    for (const day of WEEK_DAYS) {
      if (!includedDays.value.has(day)) continue
      for (const slot of MEAL_SLOTS) {
        const val = plan.value.meals?.[day]?.[slot as MealSlot]
        if (typeof val !== 'object' || val === null) continue
        const food = val as CustomFood
        if (food.excludeFromShoppingList) continue
        const name = food.name.trim()
        if (!name) continue
        splitCompoundItem(name).forEach(bump)
      }
    }
  }

  return Array.from(counts.entries())
    .map(([key, { item, count }]) => ({ id: `other-${key}`, item, count }))
    .sort((a, b) => a.item.localeCompare(b.item, 'da'))
})

// Checked-off state survives a refresh (handy mid-grocery-trip) but is
// scoped to this plan and never sent to the server. Loaded in onMounted
// (client-only) rather than at setup so the initial render still matches
// the server-rendered (empty) markup and avoids a hydration mismatch.
const storageKey = `shopping-list-checked-${route.params.id}`

const checked = ref<Set<string>>(new Set())

onMounted(() => {
  const stored = localStorage.getItem(storageKey)
  if (stored) checked.value = new Set(JSON.parse(stored))
})

const toggleChecked = (id: string) => {
  if (checked.value.has(id)) checked.value.delete(id)
  else checked.value.add(id)
  checked.value = new Set(checked.value)
}

watch(checked, (val) => {
  if (import.meta.client) localStorage.setItem(storageKey, JSON.stringify([...val]))
})
</script>
