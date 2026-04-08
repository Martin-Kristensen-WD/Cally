<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold text-charcoal-800">Recipes</h1>
      <NuxtLink to="/admin/recipes/new" class="btn-primary">
        + New Recipe
      </NuxtLink>
    </div>

    <div v-if="pending" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-16 bg-white rounded-xl animate-pulse" />
    </div>

    <div v-else-if="recipes?.length" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="border-b border-cream-200">
          <tr class="text-left text-xs font-semibold text-charcoal-700/50 uppercase tracking-wide">
            <th class="px-6 py-4">Recipe</th>
            <th class="px-6 py-4 hidden sm:table-cell">Category</th>
            <th class="px-6 py-4 hidden sm:table-cell">Calories</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-cream-100">
          <tr v-for="recipe in recipes" :key="recipe.id" class="hover:bg-cream-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-cream-100 flex-shrink-0">
                  <img
                    v-if="recipe.image_url"
                    :src="recipe.image_url"
                    :alt="recipe.title"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="w-full h-full flex items-center justify-center text-lg">🍽️</span>
                </div>
                <div>
                  <p class="font-semibold text-charcoal-800 text-sm">{{ recipe.title }}</p>
                  <p class="text-xs text-charcoal-700/50 hidden sm:block">{{ formatDate(recipe.created_at) }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 hidden sm:table-cell">
              <span class="category-pill text-xs px-2 py-0.5">{{ recipe.category }}</span>
            </td>
            <td class="px-6 py-4 hidden sm:table-cell text-sm text-charcoal-700/70">
              {{ recipe.estimated_calories ? `${recipe.estimated_calories} kcal` : '—' }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink :to="`/recipes/${recipe.id}`" class="btn-ghost text-xs py-1.5 px-3">View</NuxtLink>
                <NuxtLink :to="`/admin/recipes/${recipe.id}/edit`" class="btn-ghost text-xs py-1.5 px-3">Edit</NuxtLink>
                <button class="btn-ghost text-xs py-1.5 px-3 text-red-500 hover:bg-red-50" @click="handleDelete(recipe.id)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-16 text-charcoal-700/40">
      <div class="text-5xl mb-3">📋</div>
      <p class="font-display text-lg">No recipes yet.</p>
      <NuxtLink to="/admin/recipes/new" class="btn-primary mt-4 inline-flex">
        Create your first recipe
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchRecipes, deleteRecipe } = useRecipes()

const { data: recipes, pending, refresh } = await useAsyncData('admin-recipes', fetchRecipes)

const handleDelete = async (id: string) => {
  if (!confirm('Delete this recipe?')) return
  await deleteRecipe(id)
  await refresh()
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
</script>
