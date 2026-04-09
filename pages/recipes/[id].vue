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
          <div class="flex items-start justify-between gap-3 mb-4">
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

          <!-- Stats row -->
          <div class="flex items-start gap-5 mb-1">
            <div class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5 text-spice-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <div class="flex flex-wrap gap-1 justify-center">
                <span v-for="cat in recipe.categories" :key="cat" class="text-xs font-semibold text-spice-400">
                  {{ CATEGORY_LABELS[cat] ?? cat }}
                </span>
              </div>
            </div>
            <div v-if="recipe.estimated_calories" class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5 text-spice-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
              <span class="text-xs font-semibold text-spice-400">{{ recipe.estimated_calories }} kcal</span>
            </div>
            <div v-if="recipe.description" class="flex flex-col items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-5 h-5 text-spice-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span class="text-xs font-semibold text-spice-400 line-clamp-1 max-w-[70px] text-center">
                {{ recipe.description.split(' ').slice(0, 2).join(' ') }}
              </span>
            </div>
          </div>
          <div class="border-t border-spice-400/20 mb-5 mt-3" />

          <!-- Ingredients -->
          <h2 class="font-display text-lg font-bold text-charcoal-800 mb-3">Ingredients</h2>
          <ul class="space-y-2.5 mb-6">
            <li
              v-for="(ing, i) in recipe.ingredients"
              :key="i"
              class="flex items-start gap-3 cursor-pointer group"
              @click="toggleIngredient(i)"
            >
              <!-- Square checkbox -->
              <div
                class="flex-shrink-0 mt-0.5 w-4 h-4 rounded-sm border-2 border-spice-400 flex items-center justify-center transition-colors"
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
              <span
                class="text-sm leading-snug transition-opacity flex gap-1.5"
                :class="checkedIngredients[i] ? 'line-through opacity-40' : ''"
              >
                <span class="text-charcoal-800 font-semibold">{{ ing.item }}{{ ing.amount || ing.unit ? ':' : '' }}</span>
                <span v-if="ing.amount || ing.unit" class="text-charcoal-700/70">{{ ing.amount }} {{ ing.unit }}</span>
              </span>
            </li>
          </ul>

          <!-- Directions -->
          <h2 class="font-display text-lg font-bold text-charcoal-800 mb-3">Directions</h2>
          <ol class="space-y-4">
            <li
              v-for="(step, i) in recipe.directions"
              :key="i"
              class="flex gap-3 text-sm text-charcoal-700 leading-relaxed"
            >
              <span class="flex-shrink-0 font-bold text-charcoal-800">{{ i + 1 }}.</span>
              <span>{{ step }}</span>
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

watch(recipe, (r) => {
  if (r) checkedIngredients.value = new Array(r.ingredients.length).fill(false)
}, { immediate: true })

const toggleIngredient = (i: number) => {
  checkedIngredients.value[i] = !checkedIngredients.value[i]
}

const handleDelete = async () => {
  if (!confirm('Delete this recipe? This cannot be undone.')) return
  await deleteRecipe(route.params.id as string)
  await navigateTo('/')
}
</script>
