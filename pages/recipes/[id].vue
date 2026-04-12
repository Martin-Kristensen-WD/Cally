<template>
  <div class="min-h-screen bg-cream-100 py-8">
    <div class="max-w-sm sm:max-w-2xl lg:max-w-3xl mx-auto px-4">
      <!-- Back link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-[13px] font-body font-medium text-charcoal-700/60 hover:text-charcoal-800 transition-colors mb-5 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Tilbage til opskrifter
      </NuxtLink>

      <!-- Loading skeleton -->
      <div v-if="pending" class="bg-white rounded-[24px] overflow-hidden animate-pulse" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
        <div class="aspect-[4/3] bg-cream-200" />
        <div class="p-6 space-y-3">
          <div class="h-7 bg-cream-100 rounded-lg w-3/4" />
          <div class="h-4 bg-cream-100 rounded-lg w-full" />
          <div class="h-4 bg-cream-100 rounded-lg w-5/6" />
        </div>
      </div>

      <!-- Recipe card -->
      <article v-else-if="recipe" class="bg-white rounded-[24px] overflow-hidden" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
        <!-- Image -->
        <div class="aspect-[4/3] sm:aspect-[16/9] bg-cream-100 overflow-hidden relative">
          <img
            v-if="recipe.image_url"
            :src="recipe.image_url"
            :alt="recipe.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
            style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)"
          >
            <span class="font-display font-semibold leading-none select-none text-[8rem] text-charcoal-800/[0.07]">{{ recipe?.title.charAt(0) }}</span>
          </div>
        </div>

        <div class="px-6 py-6 sm:px-8 sm:py-8">
          <!-- Title + heart -->
          <div class="flex items-start justify-between gap-3 mb-2">
            <h1 class="font-display text-[26px] sm:text-[34px] font-semibold text-charcoal-800 leading-[1.2] tracking-tight">
              {{ recipe.title }}
            </h1>
            <button
              v-if="isAdmin"
              class="flex-shrink-0 mt-1 transition-colors"
              :class="saved ? 'text-sunlit' : 'text-charcoal-700/25 hover:text-sunlit'"
              aria-label="Gem opskrift"
              @click="handleToggleFavorite"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-[22px] h-[22px] transition-all duration-200"
                :class="saved ? 'scale-110' : 'scale-100'"
                :fill="saved ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-[14px] font-body text-charcoal-700/55 leading-relaxed mb-4">
            {{ recipe.description }}
          </p>

          <!-- Categories + calories -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="type in recipe.meal_types"
                :key="type"
                class="text-[11px] font-body font-medium px-2.5 py-1 rounded-full bg-charcoal-800/[0.06] text-charcoal-700/70 tracking-wide"
              >
                {{ MEAL_TYPE_LABELS[type] ?? type }}
              </span>
              <span
                v-if="recipe.dish_type"
                class="text-[11px] font-body font-medium px-2.5 py-1 rounded-full bg-charcoal-800/[0.04] text-charcoal-700/45 tracking-wide"
              >
                {{ DISH_TYPE_LABELS[recipe.dish_type] ?? recipe.dish_type }}
              </span>
            </div>
            <span v-if="recipe.estimated_calories" class="ml-3 flex-shrink-0 whitespace-nowrap">
              <span class="text-[12px] font-body font-semibold tracking-wide" :class="calorieColor(recipe.estimated_calories)">{{ recipe.estimated_calories }} kcal</span>
              <span class="text-[12px] font-body text-charcoal-800"> per portion</span>
            </span>
          </div>

          <div class="border-t border-charcoal-800/[0.06] mb-6" />

          <!-- Ingredients + Directions: side by side on sm+ -->
          <div class="sm:grid sm:grid-cols-2 sm:gap-12 sm:items-start">

          <!-- Ingredients column -->
          <div>
          <div v-if="recipe.servings" class="flex items-center justify-between mb-4">
            <span class="text-[13px] font-body font-medium text-charcoal-700/50">Portioner</span>
            <div class="flex items-center gap-2.5">
              <button
                class="w-7 h-7 rounded-full border border-charcoal-800/15 flex items-center justify-center text-charcoal-700/60 hover:border-charcoal-800/30 hover:text-charcoal-800 transition-all disabled:opacity-30"
                :disabled="currentServings <= 1"
                @click="currentServings--"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" /></svg>
              </button>
              <span class="text-[14px] font-body font-semibold text-charcoal-800 tabular-nums w-4 text-center">{{ currentServings }}</span>
              <button
                class="w-7 h-7 rounded-full border border-charcoal-800/15 flex items-center justify-center text-charcoal-700/60 hover:border-charcoal-800/30 hover:text-charcoal-800 transition-all"
                @click="currentServings++"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m-7-7h14" /></svg>
              </button>
            </div>
          </div>
          <h2 class="font-display text-[18px] font-semibold text-charcoal-800 tracking-tight mb-3">Ingredienser</h2>
          <ul class="mb-7 sm:mb-0 divide-y divide-charcoal-800/[0.05]">
            <li
              v-for="(ing, i) in recipe.ingredients"
              :key="i"
              class="flex items-center gap-3 py-2.5 cursor-pointer select-none"
              @click="toggleIngredient(i)"
            >
              <!-- Checkbox -->
              <div
                class="flex-shrink-0 w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150"
                :class="checkedIngredients[i] ? 'bg-charcoal-800 border-charcoal-800' : 'border-charcoal-800/20 bg-white'"
              >
                <svg
                  v-if="checkedIngredients[i]"
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
              <span class="flex-1 text-[14px] font-body font-medium text-charcoal-800 transition-all duration-150" :class="checkedIngredients[i] ? 'line-through opacity-35' : ''">
                {{ ing.item }}
              </span>
              <span v-if="ing.amount || ing.unit" class="text-[13px] font-body text-charcoal-700/40 tabular-nums whitespace-nowrap transition-opacity duration-150" :class="checkedIngredients[i] ? 'opacity-25' : ''">
                {{ scaledAmount(ing.amount) }} {{ ing.unit }}
              </span>
            </li>
          </ul>

          </div><!-- end ingredients column -->

          <!-- Directions -->
          <div>
          <h2 class="font-display text-[18px] font-semibold text-charcoal-800 tracking-tight mb-4">Fremgangsmåde</h2>
          <ol class="space-y-5">
            <li
              v-for="(step, i) in recipe.directions"
              :key="i"
              class="flex gap-4 cursor-pointer select-none"
              @click="toggleDirection(i)"
            >
              <div class="relative flex-shrink-0 mt-0.5">
                <span
                  class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-body font-bold transition-all duration-150"
                  :class="checkedDirections[i] ? 'bg-charcoal-800/10 text-charcoal-800/30' : 'bg-charcoal-800 text-white'"
                >{{ i + 1 }}</span>
                <span
                  v-if="step.startsWith('[!]') && !checkedDirections[i]"
                  class="absolute -top-1 -right-1.5 w-[14px] h-[14px] rounded-full bg-sunlit border-[1.5px] border-white flex items-center justify-center text-white font-body font-black leading-none"
                  style="font-size: 8px"
                >!</span>
              </div>
              <span
                class="text-[14px] font-body leading-relaxed transition-all duration-150"
                :class="[
                  checkedDirections[i] ? 'line-through opacity-35 text-charcoal-700' : step.startsWith('[!]') ? 'text-charcoal-800 font-medium' : 'text-charcoal-700'
                ]"
              >{{ step.replace(/^\[!\]/, '') }}</span>
            </li>
          </ol>
          </div><!-- end directions column -->

          </div><!-- end two-column grid -->

          <!-- Nutrition chart -->
          <div v-if="recipe.protein != null || recipe.carbs != null || recipe.fat != null" class="mt-8 pt-6 border-t border-charcoal-800/[0.06]">
            <NutritionChart
              :calories="recipe.estimated_calories"
              :protein="recipe.protein"
              :carbs="recipe.carbs"
              :fat="recipe.fat"
            />
          </div>

          <!-- Admin actions -->
          <div v-if="isAdmin" class="mt-8 pt-5 border-t border-charcoal-800/[0.06] flex gap-3">
            <NuxtLink :to="`/admin/recipes/${recipe.id}/edit`" class="btn-secondary text-sm">
              Edit recipe
            </NuxtLink>
            <button class="btn-ghost text-sm text-red-500 hover:bg-red-50" @click="handleDelete">
              Delete
            </button>
          </div>
        </div>
      </article>

      <!-- Not found -->
      <div v-else class="bg-white rounded-[24px] p-10 text-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06)">
        <p class="font-display text-xl text-charcoal-700/40 mb-4">Recipe not found.</p>
        <NuxtLink to="/" class="btn-primary">Browse recipes</NuxtLink>
      </div>
    </div>

    <!-- Related recipes slider -->
    <section v-if="relatedRecipes.length" class="mt-10 pb-6">
      <!-- Header -->
      <div class="max-w-6xl mx-auto px-5 flex items-center justify-between mb-5">
        <h2 class="font-display text-[20px] font-semibold text-charcoal-800 tracking-tight">Andre {{ relatedCategoryLabel }} opskrifter</h2>
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-full border border-charcoal-800/10 flex items-center justify-center text-charcoal-700/50 hover:text-charcoal-800 hover:border-charcoal-800/25 transition-all"
            @click="scrollRelated('left')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            class="w-8 h-8 rounded-full border border-charcoal-800/10 flex items-center justify-center text-charcoal-700/50 hover:text-charcoal-800 hover:border-charcoal-800/25 transition-all"
            @click="scrollRelated('right')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Slider -->
      <div class="relative">
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-cream-100 to-transparent z-10 pointer-events-none" />
        <div
          ref="relatedSliderRef"
          class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth -my-10 py-10"
          style="padding-left: max(1.25rem, calc((100vw - 72rem) / 2 + 1.25rem)); padding-right: 4rem"
        >
          <RecipeCard
            v-for="r in relatedRecipes"
            :key="r.id"
            :recipe="r"
            class="flex-shrink-0 w-[70vw] sm:w-72"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import { MEAL_TYPE_LABELS, DISH_TYPE_LABELS } from '~/types/recipe'

const route = useRoute()
const { fetchRecipe, fetchRecipes, deleteRecipe } = useRecipes()
const { isAdmin } = useAuth()
const { fetchFavoriteIds, toggleFavorite } = useFavorites()

const { data: recipe, pending } = await useAsyncData(
  `recipe-${route.params.id}`,
  () => fetchRecipe(route.params.id as string)
)

const saved = ref(false)
const checkedIngredients = ref<boolean[]>([])
const checkedDirections = ref<boolean[]>([])

// ── Servings scaler ───────────────────────────────────
const currentServings = ref(1)

watch(recipe, (r) => {
  if (r?.servings) currentServings.value = r.servings
}, { immediate: true })

const parseAmount = (str: string): number | null => {
  const s = str.trim()
  if (!s) return null
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3]
  const fraction = s.match(/^(\d+)\/(\d+)$/)
  if (fraction) return +fraction[1] / +fraction[2]
  const n = parseFloat(s.replace(',', '.'))
  return isNaN(n) ? null : n
}

const formatAmount = (value: number): string => {
  const whole = Math.floor(value)
  const dec = value - whole
  const fractions: [number, string][] = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾']]
  for (const [f, sym] of fractions) {
    if (Math.abs(dec - f) < 0.07) return whole > 0 ? `${whole} ${sym}` : sym
  }
  const rounded = Math.round(value * 10) / 10
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1)
}

const scaledAmount = (amount: string): string => {
  const base = recipe.value?.servings
  if (!base || currentServings.value === base) return amount
  const n = parseAmount(amount)
  if (n === null) return amount
  return formatAmount(n * (currentServings.value / base))
}

// ── Related recipes ────────────────────────────────────
const relatedRecipes = ref<Recipe[]>([])
const relatedSliderRef = ref<HTMLElement | null>(null)
const relatedCategoryLabel = computed(() => {
  const type = recipe.value?.meal_types?.[0]
  return type ? (MEAL_TYPE_LABELS[type] ?? type).toLowerCase() : ''
})

watch(recipe, async (r) => {
  if (!r?.meal_types?.length) return
  const all = await fetchRecipes(r.meal_types[0])
  relatedRecipes.value = all.filter(rec => rec.id !== r.id).slice(0, 8)
}, { immediate: true })

const scrollRelated = (direction: 'left' | 'right') => {
  relatedSliderRef.value?.scrollBy({ left: direction === 'right' ? 280 : -280, behavior: 'smooth' })
}

onMounted(async () => {
  if (isAdmin.value && recipe.value) {
    const ids = await fetchFavoriteIds()
    saved.value = ids.includes(recipe.value.id)
  }
})

const handleToggleFavorite = async () => {
  if (!recipe.value) return
  const prev = saved.value
  saved.value = !prev
  try {
    await toggleFavorite(recipe.value.id, prev)
  } catch {
    saved.value = prev
  }
}

watch(recipe, (r) => {
  if (r) {
    checkedIngredients.value = new Array(r.ingredients.length).fill(false)
    checkedDirections.value = new Array(r.directions.length).fill(false)
  }
}, { immediate: true })

const toggleIngredient = (i: number) => {
  checkedIngredients.value[i] = !checkedIngredients.value[i]
}

const toggleDirection = (i: number) => {
  checkedDirections.value[i] = !checkedDirections.value[i]
}

const calorieColor = (kcal: number) => {
  if (kcal < 300) return 'text-sunlit'
  if (kcal < 500) return 'text-amber'
  return 'text-terracotta'
}

const handleDelete = async () => {
  if (!confirm('Delete this recipe? This cannot be undone.')) return
  await deleteRecipe(route.params.id as string)
  await navigateTo('/')
}
</script>
