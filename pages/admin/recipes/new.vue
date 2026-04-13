<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin" class="inline-flex items-center gap-2 text-[13px] font-display text-charcoal-700/40 hover:text-charcoal-800 transition-colors mb-4 group">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
          <path d="M74 20 H8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M32 7 L8 20 L32 33" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Tilbage
      </NuxtLink>
      <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight">Ny opskrift</h1>
    </div>

    <div class="bg-white rounded-[20px] p-6 sm:p-10" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <RecipeForm ref="formRef" :prefill="isTest ? TEST_RECIPE : undefined" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeInsert } from '~/types/recipe'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const route = useRoute()
const isTest = route.query.test === 'true'

const TEST_RECIPE: Partial<RecipeInsert> = {
  title: '[TEST] Pasta Carbonara',
  servings: 4,
  description: 'En klassisk italiensk pasta med æg, ost og bacon. Hurtig og mættende hverdagsret.',
  meal_types: ['Dinner'],
  dish_type: 'Pasta',
  estimated_calories: 620,
  protein: 28,
  carbs: 72,
  fat: 24,
  ingredients: [
    { amount: '400', unit: 'g', item: 'spaghetti' },
    { amount: '200', unit: 'g', item: 'pancetta eller bacon' },
    { amount: '4', unit: 'stk.', item: 'æg' },
    { amount: '100', unit: 'g', item: 'parmesan, revet' },
    { amount: '2', unit: 'fed', item: 'hvidløg' },
    { amount: '', unit: '', item: 'friskkværnet sort peber' },
  ],
  directions: [
    'Kog spaghettien i rigeligt saltet vand efter pakkens anvisning. Gem et krus pastavand inden afsigtning.',
    'Steg pancettaen sprød på en pande ved middel varme. Tilsæt hvidløg de sidste 2 minutter.',
    'Pisk æg og parmesan sammen i en skål og krydr generøst med sort peber.',
    'Tag panden af varmen. Hæld den varme pasta direkte over pancettaen og bland godt.',
    'Hæld æggeblandingen over og rør hurtigt. Tilsæt lidt pastavand ad gangen til saucen er cremet.',
  ],
}

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
