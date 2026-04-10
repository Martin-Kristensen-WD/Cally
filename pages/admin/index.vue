<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Dashboard</p>
        <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight leading-none">Opskrifter</h1>
      </div>
      <NuxtLink to="/admin/recipes/new" class="btn-primary">
        + Ny opskrift
      </NuxtLink>
    </div>

    <!-- Loading -->
    <template v-if="pending">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-[20px] p-6 animate-pulse h-28" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />
      </div>
      <div class="bg-white rounded-[20px] p-6 animate-pulse h-48" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />
      <div class="bg-white rounded-[20px] p-6 animate-pulse h-64" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)" />
    </template>

    <template v-else-if="recipes?.length">

      <!-- Stat cards -->
      <div class="grid grid-cols-3 gap-4">
        <!-- Total -->
        <div class="bg-white rounded-[20px] p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-3">Opskrifter i alt</p>
          <p class="font-display text-[40px] font-semibold text-charcoal-800 leading-none tracking-tight">{{ totalRecipes }}</p>
        </div>

        <!-- With images -->
        <div class="bg-white rounded-[20px] p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-3">Med billede</p>
          <p class="font-display text-[40px] font-semibold text-charcoal-800 leading-none tracking-tight">{{ withImages }}</p>
          <p class="text-[12px] font-body text-charcoal-700/35 mt-1.5">{{ withoutImages }} mangler</p>
        </div>

        <!-- Categories covered -->
        <div class="bg-white rounded-[20px] p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-3">Kategorier dækket</p>
          <div class="flex items-baseline gap-1 leading-none">
            <p class="font-display text-[40px] font-semibold text-charcoal-800 tracking-tight">{{ coveredCategories }}</p>
            <p class="font-display text-[22px] font-semibold text-charcoal-800/25 tracking-tight">/{{ totalCategories }}</p>
          </div>
          <p v-if="missingCategories > 0" class="text-[12px] font-body text-charcoal-700/35 mt-1.5">{{ missingCategories }} mangler stadig</p>
          <p v-else class="text-[12px] font-body text-charcoal-700/35 mt-1.5">Alle kategorier dækket</p>
        </div>
      </div>

      <!-- Category breakdown -->
      <div class="bg-white rounded-[20px] p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-5">Fordeling per kategori</p>
        <div class="space-y-3">
          <div v-for="{ cat, count, label } in categoryCounts" :key="cat" class="flex items-center gap-3">
            <span class="text-[13px] font-body font-medium text-charcoal-700/70 w-28 flex-shrink-0">{{ label }}</span>
            <div class="flex-1 h-1.5 rounded-full bg-cream-100 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                style="background-color: #A8724A"
                :style="{ width: `${(count / maxCategoryCount) * 100}%` }"
              />
            </div>
            <span class="text-[13px] font-body text-charcoal-700/40 tabular-nums w-4 text-right flex-shrink-0">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- Recipe list -->
      <div class="bg-white rounded-[20px] overflow-hidden" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
        <!-- List header -->
        <div class="px-6 py-4 border-b border-charcoal-800/[0.05] flex items-center justify-between">
          <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase">Alle opskrifter</p>
          <span class="text-[12px] font-body text-charcoal-700/30">{{ totalRecipes }} stk.</span>
        </div>

        <!-- Rows -->
        <ul class="divide-y divide-charcoal-800/[0.04]">
          <li
            v-for="recipe in recipes"
            :key="recipe.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-cream-50/60 transition-colors group"
          >
            <!-- Thumbnail -->
            <div class="w-11 h-11 rounded-[10px] overflow-hidden bg-cream-100 flex-shrink-0">
              <img
                v-if="recipe.image_url"
                :src="recipe.image_url"
                :alt="recipe.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-charcoal-700/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
            </div>

            <!-- Title + meta -->
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-body font-semibold text-charcoal-800 truncate">{{ recipe.title }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  v-for="cat in recipe.categories"
                  :key="cat"
                  class="text-[11px] font-body text-charcoal-700/40"
                >{{ CATEGORY_LABELS[cat] ?? cat }}</span>
                <span v-if="recipe.estimated_calories" class="text-[11px] font-body text-charcoal-700/30">·</span>
                <span v-if="recipe.estimated_calories" class="text-[11px] font-body text-charcoal-700/40">{{ recipe.estimated_calories }} kcal</span>
              </div>
            </div>

            <!-- Date -->
            <span class="text-[12px] font-body text-charcoal-700/30 hidden sm:block flex-shrink-0">{{ formatDate(recipe.created_at) }}</span>

            <!-- Actions — revealed on hover -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
              <NuxtLink
                :to="`/recipes/${recipe.id}`"
                class="btn-ghost text-[12px] py-1.5 px-3"
              >
                Vis
              </NuxtLink>
              <NuxtLink
                :to="`/admin/recipes/${recipe.id}/edit`"
                class="btn-ghost text-[12px] py-1.5 px-3"
              >
                Rediger
              </NuxtLink>
              <button
                class="btn-ghost text-[12px] py-1.5 px-3 text-red-400 hover:bg-red-50"
                @click="handleDelete(recipe.id)"
              >
                Slet
              </button>
            </div>
          </li>
        </ul>
      </div>

    </template>

    <!-- Empty state -->
    <div v-else class="bg-white rounded-[20px] py-20 text-center" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
      <p class="font-display text-[22px] font-medium text-charcoal-800/30 tracking-tight mb-2">Ingen opskrifter endnu.</p>
      <p class="text-[13px] font-body text-charcoal-700/30 mb-6">Kom i gang ved at oprette din første opskrift.</p>
      <NuxtLink to="/admin/recipes/new" class="btn-primary">
        + Opret opskrift
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { CATEGORY_LABELS, CATEGORIES } from '~/types/recipe'

definePageMeta({ layout: 'admin', middleware: 'auth' })

const { fetchRecipes, deleteRecipe } = useRecipes()

const { data: recipes, pending, refresh } = await useAsyncData(
  'admin-recipes',
  () => fetchRecipes(),
  { server: false },
)

// ── Stats ──────────────────────────────────────────────
const totalRecipes = computed(() => recipes.value?.length ?? 0)

const withImages = computed(() => recipes.value?.filter(r => r.image_url).length ?? 0)
const withoutImages = computed(() => totalRecipes.value - withImages.value)

const totalCategories = CATEGORIES.length

const coveredCategories = computed(() => {
  const covered = new Set<string>()
  recipes.value?.forEach(r => r.categories?.forEach(c => covered.add(c)))
  return covered.size
})

const missingCategories = computed(() => totalCategories - coveredCategories.value)

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  recipes.value?.forEach(r => {
    r.categories?.forEach(cat => {
      counts[cat] = (counts[cat] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({ cat, count, label: CATEGORY_LABELS[cat] ?? cat }))
})

const maxCategoryCount = computed(() =>
  Math.max(...categoryCounts.value.map(c => c.count), 1)
)

// ── Actions ────────────────────────────────────────────
const handleDelete = async (id: string) => {
  if (!confirm('Slet denne opskrift? Dette kan ikke fortrydes.')) return
  await deleteRecipe(id)
  await refresh()
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
</script>
