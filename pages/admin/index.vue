<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.08em] uppercase mb-1">Dashboard</p>
        <h1 class="font-display text-[32px] font-semibold text-charcoal-800 tracking-tight leading-none">Opskrifter</h1>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/recipes/new" class="btn-primary">
          + Ny opskrift
        </NuxtLink>
        <NuxtLink
          to="/admin/recipes/new?test=true"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm tracking-[-0.01em] border border-charcoal-800/20 text-charcoal-700 hover:border-charcoal-800/40 hover:text-charcoal-800 transition-all duration-200"
        >
          + Ny test opskrift
        </NuxtLink>

      </div>
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
      <div class="grid grid-cols-3 gap-2 sm:gap-4">
        <!-- Total -->
        <div class="bg-white rounded-[16px] sm:rounded-[20px] p-3 sm:p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[10px] sm:text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-2 sm:mb-3 leading-tight">Opskrifter i alt</p>
          <p class="font-display text-[28px] sm:text-[40px] font-semibold text-charcoal-800 leading-none tracking-tight">{{ totalRecipes }}</p>
        </div>

        <!-- With images -->
        <div class="bg-white rounded-[16px] sm:rounded-[20px] p-3 sm:p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[10px] sm:text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-2 sm:mb-3 leading-tight">Med billede</p>
          <p class="font-display text-[28px] sm:text-[40px] font-semibold text-charcoal-800 leading-none tracking-tight">{{ withImages }}</p>
          <p class="text-[10px] sm:text-[12px] font-body text-charcoal-700/35 mt-1.5">{{ withoutImages }} mangler</p>
        </div>

        <!-- Categories covered -->
        <div class="bg-white rounded-[16px] sm:rounded-[20px] p-3 sm:p-6" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)">
          <p class="text-[10px] sm:text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase mb-2 sm:mb-3 leading-tight">Kategorier dækket</p>
          <div class="flex items-baseline gap-0.5 sm:gap-1 leading-none">
            <p class="font-display text-[28px] sm:text-[40px] font-semibold text-charcoal-800 tracking-tight">{{ coveredCategories }}</p>
            <p class="font-display text-[15px] sm:text-[22px] font-semibold text-charcoal-800/25 tracking-tight">/{{ totalCategories }}</p>
          </div>
          <p v-if="missingCategories > 0" class="text-[10px] sm:text-[12px] font-body text-charcoal-700/35 mt-1.5">{{ missingCategories }} mangler</p>
          <p v-else class="text-[10px] sm:text-[12px] font-body text-charcoal-700/35 mt-1.5">Alle dækket</p>
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
        <div class="px-6 py-4 border-b border-charcoal-800/[0.05] flex items-center gap-3">
          <input
            type="checkbox"
            :checked="allSelected"
            class="w-4 h-4 cursor-pointer flex-shrink-0"
            style="accent-color: #A8724A"
            @change="toggleSelectAll"
          />
          <p class="text-[12px] font-body font-medium text-charcoal-700/40 tracking-[0.06em] uppercase flex-1">Alle opskrifter</p>
          <button
            v-if="someSelected"
            class="text-[12px] font-body font-medium text-red-500 hover:text-red-600 transition-colors"
            @click="handleBulkDelete"
          >
            Slet valgte ({{ selectedIds.length }})
          </button>
          <span v-else class="text-[12px] font-body text-charcoal-700/30">{{ totalRecipes }} stk.</span>
        </div>

        <!-- Rows -->
        <ul class="divide-y divide-charcoal-800/[0.04]">
          <li
            v-for="recipe in recipes"
            :key="recipe.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-cream-50/60 transition-colors group"
            :class="{ 'bg-cream-50': isSelected(recipe.id) }"
          >
            <!-- Selection checkbox -->
            <input
              type="checkbox"
              :checked="isSelected(recipe.id)"
              class="w-4 h-4 cursor-pointer flex-shrink-0"
              style="accent-color: #A8724A"
              @change="toggleSelect(recipe.id)"
            />

            <!-- Thumbnail -->
            <div class="w-11 h-11 rounded-[10px] overflow-hidden bg-cream-100 flex-shrink-0">
              <img
                v-if="recipe.image_url"
                :src="recipe.image_url"
                :alt="recipe.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center" style="background: linear-gradient(145deg, #EFE8DE 0%, #E0D5C5 100%)">
                <span class="font-display font-semibold leading-none select-none text-[1.25rem] text-charcoal-800/20">{{ recipe.title.charAt(0) }}</span>
              </div>
            </div>

            <!-- Title + meta -->
            <NuxtLink :to="`/recipes/${recipe.id}`" class="flex-1 min-w-0">
              <p class="text-[14px] font-body font-semibold text-charcoal-800 truncate">{{ recipe.title }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span
                  v-for="cat in recipe.categories"
                  :key="cat"
                  class="text-[11px] font-body text-charcoal-700/40"
                >{{ CATEGORY_LABELS[cat] ?? cat }}</span>
              </div>
            </NuxtLink>

            <!-- Date — desktop only -->
            <span class="text-[12px] font-body text-charcoal-700/30 hidden sm:block flex-shrink-0">{{ formatDate(recipe.created_at) }}</span>

            <!-- Actions: always visible on mobile, hover-reveal on desktop -->
            <div class="flex items-center gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity sm:duration-150">
              <NuxtLink
                :to="`/recipes/${recipe.id}`"
                class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex"
              >
                Vis
              </NuxtLink>
              <NuxtLink
                :to="`/admin/recipes/${recipe.id}/edit`"
                class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex"
              >
                Rediger
              </NuxtLink>
              <button
                class="btn-ghost text-[12px] py-1.5 px-3 hidden sm:inline-flex"
                @click="handleDuplicate(recipe.id)"
              >
                Duplikér
              </button>
              <NuxtLink
                :to="`/admin/recipes/${recipe.id}/edit`"
                class="btn-ghost text-[12px] py-1.5 px-2 sm:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </NuxtLink>
              <button
                class="btn-ghost text-[12px] py-1.5 px-3 text-red-400 hover:bg-red-50 hidden sm:inline-flex"
                @click="handleDelete(recipe.id)"
              >
                Slet
              </button>
              <button
                class="btn-ghost text-[12px] py-1.5 px-2 text-red-400 hover:bg-red-50 sm:hidden"
                @click="handleDelete(recipe.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
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

const { fetchRecipes, deleteRecipe, deleteRecipes, duplicateRecipe } = useRecipes()

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

// ── Selection ──────────────────────────────────────────
const selectedIds = ref<string[]>([])

const allSelected = computed(() =>
  (recipes.value?.length ?? 0) > 0 && recipes.value?.every(r => selectedIds.value.includes(r.id)) === true
)
const someSelected = computed(() => selectedIds.value.length > 0)

const isSelected = (id: string) => selectedIds.value.includes(id)

const toggleSelect = (id: string) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = recipes.value?.map(r => r.id) ?? []
  }
}

// ── Actions ────────────────────────────────────────────
const handleDuplicate = async (id: string) => {
  await duplicateRecipe(id)
  await refresh()
}

const handleDelete = async (id: string) => {
  if (!confirm('Slet denne opskrift? Dette kan ikke fortrydes.')) return
  await deleteRecipe(id)
  await refresh()
}

const handleBulkDelete = async () => {
  const count = selectedIds.value.length
  if (!confirm(`Slet ${count} opskrift${count === 1 ? '' : 'er'}? Dette kan ikke fortrydes.`)) return
  await deleteRecipes([...selectedIds.value])
  selectedIds.value = []
  await refresh()
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
</script>
