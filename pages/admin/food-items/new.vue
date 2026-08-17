<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/food-items" class="inline-flex items-center gap-2 text-[13px] font-display text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4 group">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
          <path d="M74 20 H8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M32 7 L8 20 L32 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Tilbage
      </NuxtLink>
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Ny fødevare</h1>
    </div>

    <div class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <FoodItemForm ref="formRef" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FoodItemInsert } from '~/types/foodItem'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { createFoodItem, uploadImage, updateFoodItem } = useFoodItems()
const formRef = ref()

const handleSubmit = async (data: FoodItemInsert, imageFile: File | null) => {
  try {
    const item = await createFoodItem(data)

    if (imageFile) {
      const url = await uploadImage(imageFile, item.id)
      await updateFoodItem(item.id, { image_url: url })
    }

    await navigateTo('/admin/food-items')
  }
  catch (e: unknown) {
    formRef.value?.setError(e instanceof Error ? e.message : 'Kunne ikke oprette fødevaren.')
    formRef.value?.setSaving(false)
  }
}
</script>
