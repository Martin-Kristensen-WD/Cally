<template>
  <div>
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <p class="font-body text-[13px] font-medium text-terracotta tracking-[0.08em] uppercase mb-3">Mad inspiration</p>
      <h1 class="font-display text-[42px] sm:text-[56px] font-semibold text-charcoal-800 tracking-tight leading-[1.05] mb-10">
        Opskrifter<br class="hidden sm:block" /><span class="text-charcoal-800/30"> der smager af mere.</span>
      </h1>

      <CategoryFilter v-model="selectedCategory" />
    </section>

    <!-- Grid -->
    <section class="max-w-6xl mx-auto px-5 pb-16">
      <div class="flex items-center justify-between mb-6">
        <span class="text-[13px] font-body text-charcoal-700/40">
          {{ filteredCount }} {{ filteredCount !== 1 ? 'opskrifter' : 'opskrift' }}
        </span>
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
