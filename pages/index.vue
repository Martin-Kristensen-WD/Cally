<template>
  <div>
    <HeroSection />

    <section id="recipes" class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-2xl font-bold text-charcoal-800">Recipes</h2>
        <span class="text-sm text-charcoal-700/50">{{ filteredCount }} recipe{{ filteredCount !== 1 ? 's' : '' }}</span>
      </div>

      <div class="mb-8">
        <CategoryFilter v-model="selectedCategory" />
      </div>

      <RecipeGrid :recipes="recipes" :loading="pending" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchRecipes } = useRecipes()
const selectedCategory = ref('All')

const { data: recipes, pending, refresh } = await useAsyncData(
  () => `recipes-${selectedCategory.value}`,
  () => fetchRecipes(selectedCategory.value),
  { watch: [selectedCategory] }
)

const filteredCount = computed(() => recipes.value?.length ?? 0)
</script>
