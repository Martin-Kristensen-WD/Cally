<template>
  <div class="min-h-screen bg-cream-100 py-8 px-4">
    <div class="max-w-sm mx-auto">
      <!-- Back link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm text-charcoal-700/50 hover:text-spice-500 transition-colors mb-4"
      >
        ← Back
      </NuxtLink>

      <!-- Loading skeleton -->
      <div v-if="pending" class="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div class="aspect-[4/3] bg-cream-200" />
        <div class="p-5 space-y-3">
          <div class="h-7 bg-cream-200 rounded w-3/4" />
          <div class="h-4 bg-cream-200 rounded w-full" />
          <div class="h-4 bg-cream-200 rounded w-5/6" />
        </div>
      </div>

      <!-- Recipe card -->
      <article v-else-if="recipe" class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <!-- Image -->
        <div class="aspect-[4/3] bg-cream-100 overflow-hidden">
          <img
            v-if="recipe.image_url"
            :src="recipe.image_url"
            :alt="recipe.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-cream-100 to-cream-200"
          >
            🍽️
          </div>
        </div>

        <div class="px-5 py-5">
          <!-- Title + heart -->
          <div class="flex items-start justify-between gap-3 mb-2">
            <h1 class="font-display text-2xl font-bold text-charcoal-800 leading-tight">
              {{ recipe.title }}
            </h1>
            <button
              class="flex-shrink-0 mt-0.5 text-charcoal-700/30 hover:text-spice-500 transition-colors"
              aria-label="Save recipe"
              @click="saved = !saved"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-6 h-6 transition-all"
                :fill="saved ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.8"
                :class="saved ? 'text-spice-500' : ''"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>

          <!-- Description -->
          <p v-if="recipe.description" class="text-sm text-charcoal-700/60 leading-relaxed mb-4">
            {{ recipe.description }}
          </p>

          <!-- Categories + calories -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="cat in recipe.categories"
                :key="cat"
                class="text-xs font-medium px-2.5 py-1 rounded-full bg-charcoal-800/[0.06] text-charcoal-700"
              >
                {{ CATEGORY_LABELS[cat] ?? cat }}
              </span>
            </div>
            <span v-if="recipe.estimated_calories" class="text-xs font-semibold text-spice-400 whitespace-nowrap ml-3">
              {{ recipe.estimated_calories }} kcal
            </span>
          </div>

          <div class="border-t border-cream-200 mb-5" />

          <!-- Ingredients -->
          <h2 class="font-display text-lg font-bold text-charcoal-800 mb-3">Ingredienser</h2>
          <ul class="mb-6 divide-y divide-cream-200">
            <li
              v-for="(ing, i) in recipe.ingredients"
              :key="i"
              class="flex items-center gap-3 py-2.5 cursor-pointer"
              @click="toggleIngredient(i)"
            >
              <!-- Checkbox -->
              <div
                class="flex-shrink-0 w-4 h-4 rounded-sm border-2 border-spice-400 flex items-center justify-center transition-colors"
                :class="checkedIngredients[i] ? 'bg-spice-400' : 'bg-white'"
              >
                <svg
                  v-if="checkedIngredients[i]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 12 12"
                  class="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2 6l3 3 5-5" />
                </svg>
              </div>
              <!-- Name (left) + amount (right), always aligned -->
              <span class="flex-1 text-sm font-medium text-charcoal-800" :class="checkedIngredients[i] ? 'line-through opacity-40' : ''">
                {{ ing.item }}
              </span>
              <span v-if="ing.amount || ing.unit" class="text-sm text-charcoal-700/50 tabular-nums whitespace-nowrap" :class="checkedIngredients[i] ? 'opacity-40' : ''">
                {{ ing.amount }} {{ ing.unit }}
              </span>
            </li>
          </ul>

          <!-- Directions -->
          <h2 class="font-display text-lg font-bold text-charcoal-800 mb-3">Fremgangsmåde</h2>
          <ol class="space-y-4">
            <li
              v-for="(step, i) in recipe.directions"
              :key="i"
              class="flex gap-3 text-sm text-charcoal-700 leading-relaxed cursor-pointer"
              @click="toggleDirection(i)"
            >
              <span class="flex-shrink-0 font-bold text-charcoal-800 transition-opacity" :class="checkedDirections[i] ? 'opacity-40' : ''">{{ i + 1 }}.</span>
              <span class="transition-all" :class="checkedDirections[i] ? 'line-through opacity-40' : ''">{{ step }}</span>
            </li>
          </ol>

          <!-- Nutrition chart -->
          <div v-if="recipe.protein != null || recipe.carbs != null || recipe.fat != null" class="mt-8 pt-6 border-t border-cream-200">
            <NutritionChart
              :calories="recipe.estimated_calories"
              :protein="recipe.protein"
              :carbs="recipe.carbs"
              :fat="recipe.fat"
            />
          </div>

          <!-- Admin actions -->
          <div v-if="isAdmin" class="mt-8 pt-5 border-t border-cream-200 flex gap-3">
            <NuxtLink :to="`/admin/recipes/${recipe.id}/edit`" class="btn-secondary">
              Edit recipe
            </NuxtLink>
            <button class="btn-ghost text-red-500 hover:bg-red-50" @click="handleDelete">
              Delete
            </button>
          </div>
        </div>
      </article>

      <!-- Not found -->
      <div v-else class="bg-white rounded-3xl p-10 text-center shadow-sm">
        <p class="font-display text-xl text-charcoal-700/40 mb-4">Recipe not found.</p>
        <NuxtLink to="/" class="btn-primary">Browse recipes</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_LABELS } from '~/types/recipe'

const route = useRoute()
const { fetchRecipe, deleteRecipe } = useRecipes()
const { isAdmin } = useAuth()

const { data: recipe, pending } = await useAsyncData(
  `recipe-${route.params.id}`,
  () => fetchRecipe(route.params.id as string)
)

const saved = ref(false)
const checkedIngredients = ref<boolean[]>([])
const checkedDirections = ref<boolean[]>([])

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

const handleDelete = async () => {
  if (!confirm('Delete this recipe? This cannot be undone.')) return
  await deleteRecipe(route.params.id as string)
  await navigateTo('/')
}
</script>
