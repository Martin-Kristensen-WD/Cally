<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin" class="inline-flex items-center gap-1.5 text-[13px] font-body text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4">
        ← Tilbage
      </NuxtLink>
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Rediger opskrift</h1>
    </div>

    <div v-if="pending" class="bg-white rounded-[20px] p-8 animate-pulse" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <div class="h-5 bg-cream-100 rounded-lg w-1/2 mb-4" />
      <div class="h-28 bg-cream-100 rounded-xl" />
    </div>

    <div v-else-if="recipe" class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
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
  () => fetchRecipe(route.params.id as string),
  { server: false },
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
