<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin" class="text-sm text-charcoal-700/60 hover:text-spice-500 transition-colors">
        ← Tilbage til opskrifter
      </NuxtLink>
      <h1 class="font-display text-3xl font-bold text-charcoal-800 mt-2">Ny opskrift</h1>
    </div>

    <div class="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <RecipeForm ref="formRef" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeInsert } from '~/types/recipe'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { createRecipe, uploadImage } = useRecipes()
const formRef = ref()

const handleSubmit = async (data: RecipeInsert, imageFile: File | null) => {
  try {
    // Create recipe first to get an ID for the image path
    const recipe = await createRecipe(data)

    if (imageFile) {
      const url = await uploadImage(imageFile, recipe.id)
      await useRecipes().updateRecipe(recipe.id, { image_url: url })
    }

    await navigateTo('/admin')
  }
  catch (e: unknown) {
    formRef.value?.setError(e instanceof Error ? e.message : 'Failed to create recipe.')
    formRef.value?.setSaving(false)
  }
}
</script>
