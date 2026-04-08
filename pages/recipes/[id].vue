<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-charcoal-700/60 hover:text-spice-500 transition-colors mb-8">
      ← Back to recipes
    </NuxtLink>

    <div v-if="pending" class="animate-pulse space-y-4">
      <div class="h-8 bg-cream-200 rounded w-2/3" />
      <div class="h-64 bg-cream-200 rounded-2xl" />
    </div>

    <article v-else-if="recipe">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <span class="bg-spice-50 text-spice-600 text-xs font-bold px-3 py-1 rounded-full">
            {{ recipe.category }}
          </span>
          <span v-if="recipe.estimated_calories" class="calorie-badge">
            🔥 {{ recipe.estimated_calories }} kcal
          </span>
        </div>
        <h1 class="font-display text-4xl font-bold text-charcoal-800 leading-tight mb-3">
          {{ recipe.title }}
        </h1>
        <p v-if="recipe.description" class="text-lg text-charcoal-700/70">
          {{ recipe.description }}
        </p>
      </div>

      <!-- Image -->
      <div v-if="recipe.image_url" class="rounded-2xl overflow-hidden mb-10 aspect-video bg-cream-100">
        <img
          :src="recipe.image_url"
          :alt="recipe.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Two column: ingredients + directions -->
      <div class="grid sm:grid-cols-5 gap-8">
        <!-- Ingredients -->
        <div class="sm:col-span-2">
          <h2 class="font-display text-xl font-bold text-charcoal-800 mb-4">Ingredients</h2>
          <ul class="space-y-2.5">
            <li
              v-for="(ing, i) in recipe.ingredients"
              :key="i"
              class="flex items-baseline gap-2 text-sm"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-spice-400 flex-shrink-0 mt-1.5" />
              <span>
                <strong class="text-charcoal-800">{{ ing.amount }} {{ ing.unit }}</strong>
                {{ ing.item }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Directions -->
        <div class="sm:col-span-3">
          <h2 class="font-display text-xl font-bold text-charcoal-800 mb-4">Directions</h2>
          <ol class="space-y-4">
            <li
              v-for="(step, i) in recipe.directions"
              :key="i"
              class="flex gap-4"
            >
              <span class="flex-shrink-0 w-8 h-8 rounded-full bg-spice-500 text-white text-sm font-bold flex items-center justify-center">
                {{ i + 1 }}
              </span>
              <p class="text-charcoal-700 leading-relaxed pt-1">{{ step }}</p>
            </li>
          </ol>
        </div>
      </div>

      <!-- Admin actions -->
      <div v-if="isAdmin" class="mt-12 pt-8 border-t border-cream-200 flex gap-3">
        <NuxtLink :to="`/admin/recipes/${recipe.id}/edit`" class="btn-secondary">
          Edit recipe
        </NuxtLink>
        <button class="btn-ghost text-red-500 hover:bg-red-50" @click="handleDelete">
          Delete
        </button>
      </div>
    </article>

    <div v-else class="text-center py-24 text-charcoal-700/40">
      <p class="font-display text-xl">Recipe not found.</p>
      <NuxtLink to="/" class="btn-primary mt-4 inline-flex">Browse recipes</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchRecipe, deleteRecipe } = useRecipes()
const { isAdmin } = useAuth()

const { data: recipe, pending } = await useAsyncData(
  `recipe-${route.params.id}`,
  () => fetchRecipe(route.params.id as string)
)

const handleDelete = async () => {
  if (!confirm('Delete this recipe? This cannot be undone.')) return
  await deleteRecipe(route.params.id as string)
  await navigateTo('/')
}
</script>
