<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-[13px] font-body text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4">
        ← Tilbage
      </NuxtLink>
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Ny opskrift</h1>
    </div>

    <div class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
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
