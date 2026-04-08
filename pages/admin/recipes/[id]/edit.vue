<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin" class="text-sm text-charcoal-700/60 hover:text-spice-500 transition-colors">
        ← Back to recipes
      </NuxtLink>
      <h1 class="font-display text-3xl font-bold text-charcoal-800 mt-2">Edit Recipe</h1>
    </div>

    <div v-if="pending" class="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
      <div class="h-6 bg-cream-200 rounded w-1/2 mb-4" />
      <div class="h-32 bg-cream-200 rounded" />
    </div>

    <div v-else-if="recipe" class="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <RecipeForm ref="formRef" :recipe="recipe" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeInsert } from '~/types/recipe'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const { fetchRecipe, updateRecipe, uploadImage } = useRecipes()
const formRef = ref()

const { data: recipe, pending } = await useAsyncData(
  `edit-recipe-${route.params.id}`,
  () => fetchRecipe(route.params.id as string)
)

const handleSubmit = async (data: RecipeInsert, imageFile: File | null) => {
  try {
    let imageUrl = data.image_url

    if (imageFile) {
      imageUrl = await uploadImage(imageFile, route.params.id as string)
    }

    await updateRecipe(route.params.id as string, { ...data, image_url: imageUrl })
    await navigateTo('/admin')
  }
  catch (e: unknown) {
    formRef.value?.setError(e instanceof Error ? e.message : 'Failed to update recipe.')
    formRef.value?.setSaving(false)
  }
}
</script>
